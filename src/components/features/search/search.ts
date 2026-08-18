import { debounce } from 'throttle-debounce-ts';
import { SEARCH } from '@/api/request/index';
import type { Product } from '@/components/features/search/search.types';

export default class Search {
	readonly $element: HTMLFormElement;
	readonly $layer: HTMLElement | null;
	readonly $result: HTMLElement | null;
	readonly $field: HTMLInputElement | null;
	readonly $apply: HTMLButtonElement | null;
	readonly $clear: HTMLButtonElement | null;
	readonly $close: HTMLButtonElement | null;

	private $liveStatus: HTMLElement | null = null;
	private activeOptionIndex: number = -1;
	private $options: HTMLAnchorElement[] = [];

	protected length: number = 3;
	protected debouncedSearch;

	constructor($selector: HTMLFormElement) {
		this.$element = $selector;
		this.$layer = this.$element.querySelector('.js-search__layer');
		this.$result = this.$element.querySelector('.js-search__result');
		this.$field = this.$element.querySelector('.js-search__field');
		this.$apply = this.$element.querySelector('.js-search__apply');
		this.$clear = this.$element.querySelector('.js-search__clear');
		this.$close = this.$element.querySelector('.js-search__close');

		this.debouncedSearch = debounce(200, (value: string) => this.search(value));

		this.init();
	}

	public init() {
		this.createLiveStatus();
		this.$element.addEventListener('submit', this.submitHandler);
		this.$field?.addEventListener('input', this.inputHandler);
		this.$field?.addEventListener('focus', this.focusHandler);
		this.$field?.addEventListener('keydown', this.keyboardNavigationHandler);
		this.$layer?.addEventListener('click', this.closeHandler);
		this.$close?.addEventListener('click', this.closeHandler);
		this.$clear?.addEventListener('click', this.clearHandler);
		window.addEventListener('keydown', this.escHandler);
		this.$element.classList.add('initialized');
		this.$field?.setAttribute('aria-expanded', 'false');
	}

	public destroy() {
		this.$element.removeEventListener('submit', this.submitHandler);
		this.$field?.removeEventListener('input', this.inputHandler);
		this.$field?.removeEventListener('focus', this.focusHandler);
		this.$field?.removeEventListener('keydown', this.keyboardNavigationHandler);
		this.$layer?.removeEventListener('click', this.closeHandler);
		this.$close?.removeEventListener('click', this.closeHandler);
		this.$clear?.removeEventListener('click', this.clearHandler);
		window.removeEventListener('keydown', this.escHandler);
		this.$liveStatus?.remove();
		this.debouncedSearch.cancel();
	}

	public reinit() {
		this.destroy();
		this.init();
	}

	private createLiveStatus() {
		this.$liveStatus = document.createElement('div');
		this.$liveStatus.setAttribute('aria-live', 'polite');
		this.$liveStatus.setAttribute('aria-atomic', 'true');
		this.$liveStatus.className = 'visually-hidden';
		this.$element.appendChild(this.$liveStatus);
	}

	private updateLiveStatus(text: string) {
		if (this.$liveStatus) {
			this.$liveStatus.textContent = text;
		}
	}

	public clear() {
		if (!this.$field) return;

		this.$field.value = '';
		this.$field.focus();
		this.toggleEntered(false);
		this.clearActiveOption();
		this.updateLiveStatus('Поле поиска очищено');
	}

	public search(query: string) {
		this.toggleLoading(true);
		this.updateLiveStatus('Загрузка результатов...');

		SEARCH(query)
			.then((response) => {
				this.render(response, query);
				this.toggleLoading(false);
			})
			.catch((error) => {
				window.app.notify?.append({
					type: 'error',
					delay: 10000,
					title: 'Ошибка',
					text: error instanceof Error ? error.message : String(error),
				});
				this.toggleLoading(false);
				this.updateLiveStatus('Ошибка при загрузке результатов');
			});
	}

	private render(data: Product[], query: string) {
		if (!this.$result) return;

		const categoryCache: string[] = [];
		const fragment = document.createDocumentFragment();
		this.$options = [];
		this.activeOptionIndex = -1;

		if (data.length) {
			const result = data.length > this.length ? data.slice(0, this.length) : data;

			const $categoryList = document.createElement('div');
			$categoryList.className = 'search-result__block search-result__block--category';
			$categoryList.setAttribute('role', 'group');
			$categoryList.setAttribute('aria-label', 'Категории');

			const $productList = document.createElement('div');
			$productList.className = 'search-result__block search-result__block--product';
			$productList.setAttribute('role', 'group');
			$productList.setAttribute('aria-label', 'Товары');

			result.forEach((item, index) => {
				if (!categoryCache.includes(item.category)) {
					const $category = document.createElement('a');
					$category.href = '/pages/catalog.html';
					$category.textContent = item.category;
					$category.setAttribute('role', 'option');
					$category.id = `search-opt-cat-${index}`;

					$categoryList.appendChild($category);
					categoryCache.push(item.category);
					this.$options.push($category);
				}

				const $card = document.createElement('a');
				$card.className = 'search-card';
				$card.href = item.href;
				$card.setAttribute('role', 'option');
				$card.id = `search-opt-prod-${index}`;

				const $picture = document.createElement('picture');
				$picture.className = 'search-card__preview';

				if (item.image) {
					const $img = document.createElement('img');
					$img.src = item.image;
					$img.alt = item.name;
					$picture.appendChild($img);
				}

				const $content = document.createElement('div');
				$content.className = 'search-card__content';

				const $name = document.createElement('div');
				$name.className = 'search-card__name';
				$name.innerHTML = this.highlightMatch(item.name, query);

				const $price = document.createElement('div');
				$price.className = 'search-card__price';
				$price.textContent = `${item.priceNew} ₽`;

				$content.appendChild($name);
				$content.appendChild($price);

				$card.appendChild($picture);
				$card.appendChild($content);

				$productList.appendChild($card);
				this.$options.push($card);
			});

			fragment.appendChild($categoryList);
			fragment.appendChild($productList);

			if (data.length > this.length && this.$field) {
				const url = new URL(this.$element.action, location.origin);
				url.searchParams.set('query', this.$field.value);

				const $fully = document.createElement('a');
				$fully.href = url.href;
				$fully.className = 'search-result__fully';
				$fully.textContent = 'Все результаты';
				$fully.id = 'search-opt-fully';
				$fully.setAttribute('role', 'option');

				fragment.appendChild($fully);
				this.$options.push($fully);
			}

			this.updateLiveStatus(`Найдено результатов: ${this.$options.length}. Используйте стрелки вверх и вниз для навигации.`);
			this.$field?.setAttribute('aria-expanded', 'true');
		} else {
			const $empty = document.createElement('div');
			$empty.className = 'search-result__empty';
			$empty.innerHTML = `По вашему запросу <b>«${query}»</b> товаров нет.`;

			fragment.appendChild($empty);
			this.updateLiveStatus(`По запросу ${query} товаров нет.`);
			this.$field?.setAttribute('aria-expanded', 'true');
		}

		this.$result.textContent = '';
		this.$result.appendChild(fragment);
	}

	private keyboardNavigationHandler = (event: KeyboardEvent) => {
		if (!this.$options.length) return;

		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				this.moveFocus(1);
				break;
			case 'ArrowUp':
				event.preventDefault();
				this.moveFocus(-1);
				break;
			case 'Enter':
				if (this.activeOptionIndex >= 0) {
					event.preventDefault();
					this.$options[this.activeOptionIndex].click();
				}
				break;
		}
	};

	private moveFocus(direction: number) {
		this.clearActiveOption();

		this.activeOptionIndex += direction;

		if (this.activeOptionIndex >= this.$options.length) {
			this.activeOptionIndex = 0;
		} else if (this.activeOptionIndex < 0) {
			this.activeOptionIndex = this.$options.length - 1;
		}

		const $activeOption = this.$options[this.activeOptionIndex];
		$activeOption.classList.add('is-focused');
		$activeOption.scrollIntoView({ block: 'nearest' });

		this.$field?.setAttribute('aria-activedescendant', $activeOption.id);
	}

	private clearActiveOption() {
		this.$options.forEach(($opt) => $opt.classList.remove('is-focused'));
		this.$field?.removeAttribute('aria-activedescendant');
	}

	private toggleEntered(key: boolean) {
		this.$element.classList.toggle('entered', key);
		if (this.$apply) this.$apply.disabled = !key;

		if (!key) {
			this.$field?.setAttribute('aria-expanded', 'false');
			if (this.$result) this.$result.textContent = '';
		}
	}

	private toggleActive(key: boolean) {
		this.$element.classList.toggle('active', key);
		document.body.classList.toggle('search-open', key);
		if (!key) {
			this.$field?.setAttribute('aria-expanded', 'false');
			this.clearActiveOption();
		}
	}

	private toggleLoading(key: boolean) {
		this.$element.classList.toggle('loading', key);
	}

	private highlightMatch(text: string, query: string) {
		const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const regex = new RegExp(escapedQuery, 'i');
		return text.replace(regex, '<b>$&</b>');
	}

	private inputHandler = (event: Event) => {
		const target = event.target as HTMLInputElement;
		this.toggleEntered(target.value.length > 1);
		if (target.value.length > 1) {
			this.debouncedSearch(target.value);
		}
	};

	private focusHandler = () => {
		this.toggleActive(true);
	};

	private closeHandler = () => {
		this.toggleActive(false);
	};

	private clearHandler = () => {
		this.clear();
	};

	private submitHandler = (event: SubmitEvent) => {
		event.preventDefault();
		if (!this.$field || this.$field.value.length <= 1) return;
		const url = new URL(this.$element.action, location.origin);
		url.searchParams.set('query', this.$field.value);
		window.location.href = url.href;
	};

	private escHandler = (event: KeyboardEvent) => {
		if (event.key === 'Escape' && this.$element.classList.contains('active')) {
			this.toggleActive(false);
			this.$field?.blur();
		}
	};
}
