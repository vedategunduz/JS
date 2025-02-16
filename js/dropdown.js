class Dropdown {
    constructor() {
        this.triggers = document.querySelectorAll('[data-dropdown-trigger]');
        this.targets = document.querySelectorAll('[data-dropdown-target]');

        this.init();
    }

    init() {
        this.triggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                this.toggle(trigger);
            });
        });

        document.addEventListener('click', (e) => this.handleOutsideClick(e));
    }

    toggle(trigger) {
        if (trigger.getAttribute('aria-expanded') === 'true')
            this.hide(trigger);
        else
            this.show(trigger);
    }

    show(trigger) {
        const target = document.getElementById(trigger.dataset.dropdownTrigger);

        target.querySelectorAll('[role="menuitem"]').forEach(menuitem => { menuitem.removeAttribute('tabindex'); });

        trigger.setAttribute('aria-expanded', 'true');
        target.setAttribute('aria-hidden', 'false');

        target.classList.remove('hidden');

        let x = trigger.getBoundingClientRect().left;
        let y = trigger.getBoundingClientRect().bottom;

        const targetWidth = target.offsetWidth;
        const targetHeight = target.offsetHeight;

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        if (x + targetWidth > windowWidth) {
            target.style.left = `${windowWidth - targetWidth}px`;
        } else {
            target.style.left = `${x}px`;
        }

        if (y + targetHeight > windowHeight) {
            target.style.top = `${windowHeight - targetHeight}px`;
        }
        else {
            target.style.top = `${y}px`;
        }

        this.closeOtherTargets(target);
    }

    hide(trigger) {
        const target = document.getElementById(trigger.dataset.dropdownTrigger);

        target.querySelectorAll('[role="menuitem"]').forEach(menuitem => {
            menuitem.setAttribute('tabindex', '-1');
        });

        trigger.setAttribute('aria-expanded', 'false');
        target.setAttribute('aria-hidden', 'true');
        target.classList.add('hidden');
    }

    closeOtherTargets(targetEl) {
        const targets = document.querySelectorAll('[data-dropdown-target][aria-hidden="false"]');

        targets.forEach(target => {
            if (target == targetEl)
                return;

            target.setAttribute('aria-hidden', 'true');
            target.classList.add('hidden');

            target.querySelectorAll('[role="menuitem"]').forEach(menuitem => {
                menuitem.setAttribute('tabindex', '-1');
            });
        });
    }

    handleOutsideClick(event) {
        if (!event.target.closest('[data-dropdown-trigger], [data-dropdown-target]')) {

            const targets = document.querySelectorAll('[data-dropdown-target][aria-hidden="false"]');
            const triggers = document.querySelectorAll('[data-dropdown-trigger][aria-expanded="true"]');

            targets.forEach(target => {
                target.setAttribute('aria-hidden', 'true');
                target.classList.add('hidden');

                target.querySelectorAll('[role="menuitem"]').forEach(menuitem => {
                    menuitem.setAttribute('tabindex', '-1');
                });
            });

            triggers.forEach(trigger => {
                trigger.setAttribute('aria-expanded', 'false');
            });
        }
    }
}
