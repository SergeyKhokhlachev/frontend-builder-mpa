export const header = () => {
	const container = document.querySelector('.js-header');

	window.addEventListener('scroll', () => {
		const offset = window.scrollY;
		if (offset > 500) {
			container.classList.add('stiky');
		} else {
			container.classList.remove('stiky');
		}
	});
};
