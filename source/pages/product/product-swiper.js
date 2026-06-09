import Swiper from 'swiper';
import { Navigation, Pagination, EffectFade, Thumbs, Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/zoom';

export class ProductSwiper {
	constructor(selector, options = {}) {
		this.$container = selector;
		this.active = 0;
		this.open = false;
		this.desktop = 1280;
		this.view = null;

		if (!this.$container) return;

		this.zoom = options.zoom || 3;
		this.selectorMain = options.selectorMain || '.product-swiper-main';
		this.selectorThumb = options.selectorThumb || '.product-swiper-thumb';
		this.selectorModalMain = options.selectorModalMain || '.modal-swiper-main';
		this.selectorModalThumb = options.selectorModalThumb || '.modal-swiper-thumb';
		this.selectorPagination = options.selectorPagination || '.swiper-pagination';
		this.selectorZoom = options.selectorZoom || '.swiper-zoom-container';
		this.selectorNext = options.selectorNext || '.swiper-next';
		this.selectorPrev = options.selectorPrev || '.swiper-prev';
		this.selectorClose = options.selectorClose || '.modal-swiper-close';

		this.init();
	}

	init() {
		this.$main = this.$container.querySelector(this.selectorMain);
		this.$thumb = this.$container.querySelector(this.selectorThumb);
		this.$pagination = this.$container.querySelector(this.selectorPagination);

		this.$elemensMain = this.$main.querySelectorAll('.swiper-slide');
		this.$elemensThumb = this.$thumb.querySelectorAll('.swiper-slide');

		this.fragmentMain = new DocumentFragment();
		this.fragmentThumb = new DocumentFragment();

		this.$elemensMain.forEach((element) =>
			this.fragmentMain.appendChild(element.cloneNode(true)),
		);
		this.$elemensThumb.forEach((element) =>
			this.fragmentThumb.appendChild(element.cloneNode(true)),
		);

		this.swiperThumb = new Swiper(this.$thumb, {
			slidesPerView: 'auto',
			spaceBetween: 0,
			direction: 'vertical',
		});

		this.swiperMain = new Swiper(this.$main, {
			modules: [Pagination, EffectFade, Thumbs, Zoom],
			slidesPerView: 1,
			spaceBetween: 0,
			rewind: true,
			effect: 'fade',
			fadeEffect: {
				crossFade: true,
			},
			zoom: true,
			pagination: {
				el: this.$pagination,
				clickable: true,
			},
			thumbs: {
				swiper: this.swiperThumb,
			},
		});

		this.renderModal();
		this.checkZoom(true);

		this.openHandler = this.openHandler.bind(this);
		this.$main.addEventListener('click', this.openHandler);

		this.changeHandler = this.changeHandler.bind(this);
		this.swiperMain.on('slideChange', this.changeHandler);

		this.slideHandler = this.slideHandler.bind(this);
		this.swiperThumb.slides.forEach((slide) => {
			slide.addEventListener('mouseenter', this.slideHandler);
		});

		this.zoomInHandler = this.zoomInHandler.bind(this);
		this.$main.addEventListener('mouseenter', this.zoomInHandler);

		this.zoomOutHandler = this.zoomOutHandler.bind(this);
		this.$main.addEventListener('mouseleave', this.zoomOutHandler);

		this.moveHeandler = this.moveHeandler.bind(this);
		this.$main.addEventListener('mousemove', this.moveHeandler);

		this.resizeHeandler = this.resizeHeandler.bind(this);
		window.addEventListener('resize', this.resizeHeandler);
	}

	initModal() {
		const close = this.modal.querySelector(this.selectorClose);
		const modalMain = this.modal.querySelector(this.selectorModalMain);
		const modalThumb = this.modal.querySelector(this.selectorModalThumb);

		modalMain.querySelector('.swiper-wrapper').append(this.fragmentMain);
		modalThumb.querySelector('.swiper-wrapper').append(this.fragmentThumb);

		this.swiperThumbModal = new Swiper(modalThumb, {
			slidesPerView: 'auto',
			spaceBetween: 0,
		});

		this.swiperMainModal = new Swiper(modalMain, {
			modules: [Navigation, Pagination, EffectFade, Thumbs, Zoom],
			slidesPerView: 1,
			spaceBetween: 0,
			rewind: true,
			effect: 'fade',
			fadeEffect: {
				crossFade: true,
			},
			zoom: true,
			pagination: {
				el: modalMain.querySelector(this.selectorPagination),
				clickable: true,
			},
			navigation: {
				prevEl: modalMain.querySelector(this.selectorPrev),
				nextEl: modalMain.querySelector(this.selectorNext),
			},
			thumbs: {
				swiper: this.swiperThumbModal,
			},
		});

		this.closeHandler = this.closeHandler.bind(this);
		close.addEventListener('click', this.closeHandler);

		this.changeModalHandler = this.changeModalHandler.bind(this);
		this.swiperMainModal.on('slideChange', this.changeModalHandler);

		this.slideModalHandler = this.slideModalHandler.bind(this);
		this.swiperThumbModal.slides.forEach((slide) => {
			slide.addEventListener('mouseenter', this.slideModalHandler);
		});
	}

	changeHandler(swiper) {
		this.active = swiper.activeIndex;
		if (!this.open) this.checkVideo(this.swiperMain, swiper.previousIndex, swiper.activeIndex);
	}

	changeModalHandler(swiper) {
		this.active = swiper.activeIndex;
		if (this.open)
			this.checkVideo(this.swiperMainModal, swiper.previousIndex, swiper.activeIndex);
	}

	slideHandler(event) {
		const index = this.swiperThumb.slides.indexOf(event.target);
		this.swiperThumb.slideTo(index);
		this.swiperMain.slideTo(index);
	}

	slideModalHandler(event) {
		const index = this.swiperThumbModal.slides.indexOf(event.target);
		this.swiperThumbModal.slideTo(index);
		this.swiperMainModal.slideTo(index);
	}

	openHandler() {
		const target = this.swiperMain.slides[this.swiperMain.activeIndex];
		if (!target.classList.contains('swiper-slide-video')) {
			this.swiperThumbModal.slideTo(this.active);
			this.swiperMainModal.slideTo(this.active);
			this.modal.classList.add('active');
			this.open = true;
		}
	}

	closeHandler() {
		this.checkVideo(this.swiperMainModal, this.active);
		this.swiperThumb.slideTo(this.active);
		this.swiperMain.slideTo(this.active);
		this.modal.classList.remove('active');
		this.open = false;
	}

	zoomInHandler() {
		const target = this.swiperMain.slides[this.swiperMain.activeIndex];
		if (!target.classList.contains('swiper-slide-video') && this.view === 'desktop') {
			this.zoomIn(this.swiperMain);
		}
	}

	zoomOutHandler() {
		const target = this.swiperMain.slides[this.swiperMain.activeIndex];
		if (!target.classList.contains('swiper-slide-video') && this.view === 'desktop') {
			this.zoomOut(this.swiperMain);
		}
	}

	moveHeandler(event) {
		const target = this.swiperMain.slides[this.swiperMain.activeIndex];
		if (!target.classList.contains('swiper-slide-video') && this.view === 'desktop') {
			this.zoomMove(this.swiperMain, event.clientX, event.clientY);
		}
	}

	resizeHeandler() {
		this.checkZoom();
	}

	zoomIn(swiper) {
		swiper.zoom.in(this.zoom);
	}

	zoomOut(swiper) {
		swiper.zoom.out();
	}

	zoomMove(swiper, clientX, clientY) {
		const element = swiper.slides[this.active].querySelector(this.selectorZoom);
		const rect = swiper.slides[this.active].getBoundingClientRect();

		const translateX = this.getTranslate(clientX - rect.left, rect.width, this.zoom);
		const translateY = this.getTranslate(clientY - rect.top, rect.height, this.zoom);

		if (element) element.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
	}

	checkVideo(swiper, pause, play) {
		const videoPause = pause ? swiper.slides[pause].querySelector('video') : null;
		const videoPlay = play ? swiper.slides[play].querySelector('video') : null;
		if (videoPause) videoPause.pause();
		if (videoPlay) videoPlay.play();
	}

	checkZoom(init = false) {
		const desktop = window.innerWidth >= this.desktop;
		if (init) this.view = desktop ? 'mobile' : 'desktop';

		if (this.view === 'mobile' && desktop) {
			this.swiperMain.zoom.enable();
			this.swiperMainModal.zoom.disable();
			this.view = 'desktop';
		}
		if (this.view === 'desktop' && !desktop) {
			this.swiperMain.zoom.disable();
			this.swiperMainModal.zoom.enable();
			this.view = 'mobile';
		}
	}

	getTranslate(position, size, scale) {
		return Math.round((size / 2 - position) * scale * ((1 / scale) * (scale - 1)));
	}

	renderModal() {
		this.createModal();
		this.initModal();
	}

	createModal() {
		this.modal = document.createElement('div');
		this.modal.className = 'modal-swiper';
		this.modal.innerHTML = `
			<div class="modal-swiper__content">
				<button class="modal-swiper-close" type="button">
					<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M5 5L25 25" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M5 25L25 5" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
				${this.createModalSwiperMain()}
				${this.createModalSwiperThumb()}
			</div>
		`;
		document.body.appendChild(this.modal);
	}

	createModalSwiperMain() {
		return `
			<div class="swiper modal-swiper-main">
				<div class="swiper-wrapper"></div>
				<div class="swiper-pagination"></div>
				<button class="swiper-prev" type="button">
					<svg width="13" height="22" viewBox="0 0 13 22" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M1.83331 1L11.8333 11L1.83331 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
				<button class="swiper-next" type="button">
					<svg width="13" height="22" viewBox="0 0 13 22" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M1.83331 1L11.8333 11L1.83331 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
			</div>
		`;
	}

	createModalSwiperThumb() {
		return `
			<div class="swiper modal-swiper-thumb">
				<div class="swiper-wrapper"></div>
			</div>
		`;
	}
}
