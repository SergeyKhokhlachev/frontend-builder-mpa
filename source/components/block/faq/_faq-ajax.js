export const faqAjax = () => {
	function reqestLoad(faqContent, faqButton, faqCollapse) {
		const promise = new Promise((resolve) => {
			faqButton.classList.add('loading');
			setTimeout(() => {
				resolve();
			}, 1000);
		});

		promise.then(() => {
			const faqList = faqContent.querySelectorAll('.faq__element');
			const faqElementClone = faqList[0].cloneNode(true);
			const collapseInstance = app.classInstance.get(faqCollapse);
			faqContent.appendChild(faqElementClone);
			collapseInstance?.collapse.reinit();
			if (faqList.length > 10) faqButton.classList.add('hidden');
			faqButton.classList.remove('loading');
		});
	}

	const faqContainer = document.querySelector('.js-demo-faq');

	if (!faqContainer) return;

	const faqCollapse = document.querySelector('.js-collapse');
	const faqContent = faqContainer.querySelector('.faq__list');
	const faqButton = faqContainer.querySelector('.faq__button');

	if (!faqCollapse && !faqContent && !faqButton) return;

	faqButton.addEventListener('click', () => {
		reqestLoad(faqContent, faqButton, faqCollapse);
	});
};
