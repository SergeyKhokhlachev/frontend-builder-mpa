export default function loader(key: boolean) {
	const loader = document.querySelector('.js-page-loader');
	loader?.classList.toggle('active', key);
}
