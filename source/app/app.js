import.meta.globEager('/assets/images/**/*.{jpg,jpeg,png}', {
	query: { format: 'webp' },
});

import { vars } from './config/variables';

import {
	disableScroll,
	enableScroll,
	getDeviceType,
	classInstance,
} from '@/shared/helpers/helpers';

import { PictureLazy } from '@/shared/common/picture/picture';
import { Collapse } from '@/shared/common/collapse/collapse';
import { Dropdown } from '@/shared/common/dropdown/dropdown';
import { Popover } from '@/shared/common/popover/popover';
import { Scrollbar } from '@/shared/common/scrollbar/scrollbar';
import { Scrollto } from '@/shared/common/scrollto/scrollto';
import { Sticky } from '@/shared/common/sticky/sticky';
import { Tabs } from '@/shared/common/tabs/tabs';
import { Timer } from '@/shared/common/timer/timer';
import { Video } from '@/shared/common/video/video';

import { Form } from '@/shared/form/form';
import { Modal } from '@/shared/modal/modal';
import { Notify } from '@/shared/notify/notify';

import { getValidateMessage } from '@/api/services/validate-message';

window.app = {};
window.vars = vars;
window.app.validateMessage = getValidateMessage();

window.app.classInstance = classInstance;
window.app.disableScroll = disableScroll;
window.app.enableScroll = enableScroll;
window.app.getDeviceType = getDeviceType;

window.app.PictureLazy = PictureLazy;
window.app.Collapse = Collapse;
window.app.Dropdown = Dropdown;
window.app.Popover = Popover;
window.app.Scrollbar = Scrollbar;
window.app.Scrollto = Scrollto;
window.app.Sticky = Sticky;
window.app.Tabs = Tabs;
window.app.Timer = Timer;
window.app.Video = Video;

window.app.Form = Form;
window.app.Notify = Notify;
window.app.Modal = Modal;

window.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('picture.js-lazy').forEach((element) => new PictureLazy(element));
	document.querySelectorAll('.js-collapse').forEach((element) => new Collapse(element));
	document.querySelectorAll('.js-dropdown').forEach((element) => new Dropdown(element));
	document.querySelectorAll('.js-popover').forEach((element) => new Popover(element));
	document.querySelectorAll('.js-scrollbar').forEach((element) => new Scrollbar(element));
	document.querySelectorAll('.js-scrollto').forEach((element) => new Scrollto(element));
	document.querySelectorAll('.js-tabs').forEach((element) => new Tabs(element));
	document.querySelectorAll('.js-video').forEach((element) => new Video(element));
	document.querySelectorAll('.js-form').forEach((element) => new Form(element));
	new Notify();
	new Modal();
});
