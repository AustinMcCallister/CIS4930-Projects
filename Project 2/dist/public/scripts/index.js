"use strict";
const buttonHandler = (() => {
    const _GETModule = document.querySelector('.GET');
    const _POSTModule = document.querySelector('.POST');
    const _PATCHModule = document.querySelector('.PATCH');
    const _DELETEModule = document.querySelector('.DELETE');
    const _GETButton = _GETModule.querySelector('button');
    const _POSTButton = _POSTModule.querySelector('button');
    const _PATCHButton = _PATCHModule.querySelector('button');
    const _DELETEButton = _DELETEModule.querySelector('button');
    const _GETResponse = _GETModule.querySelector('.module-response');
    const _POSTResponse = _POSTModule.querySelector('.module-response');
    const _PATCHResponse = _PATCHModule.querySelector('.module-response');
    const _DELETEResponse = _DELETEModule.querySelector('.module-response');
    _GETButton.addEventListener('click', () => {
        const userId = _GETModule.querySelector('.user-id');
        if (userId.value) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'http://localhost:3000/users/' + userId.value, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                userId: userId.value,
            }));
            xhr.onload = () => {
                console.log(xhr.responseText);
                _GETResponse.innerHTML = xhr.responseText;
            };
            userId.value = '';
        }
    });
    _POSTButton.addEventListener('click', () => {
        const userId = _POSTModule.querySelector('.user-id');
        const firstName = _POSTModule.querySelector('.first-name');
        const lastName = _POSTModule.querySelector('.last-name');
        const emailAddress = _POSTModule.querySelector('.email-address');
        const password = _POSTModule.querySelector('.password');
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3000/users/', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            userId: userId.value,
            firstName: firstName.value,
            lastName: lastName.value,
            emailAddress: emailAddress.value,
            password: password.value
        }));
        xhr.onload = () => {
            console.log(xhr.responseText);
            _POSTResponse.innerHTML = xhr.responseText;
        };
        userId.value = '';
        firstName.value = '';
        lastName.value = '';
        emailAddress.value = '';
        password.value = '';
    });
    _PATCHButton.addEventListener('click', () => {
        const userId = _PATCHModule.querySelector('.user-id');
        const firstName = _PATCHModule.querySelector('.first-name');
        const lastName = _PATCHModule.querySelector('.last-name');
        const emailAddress = _PATCHModule.querySelector('.email-address');
        const password = _PATCHModule.querySelector('.password');
        if (userId.value) {
            const xhr = new XMLHttpRequest();
            xhr.open('PATCH', 'http://localhost:3000/users/' + userId.value, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                firstName: firstName.value,
                lastName: lastName.value,
                emailAddress: emailAddress.value,
                password: password.value
            }));
            xhr.onload = () => {
                console.log(xhr.responseText);
                _PATCHResponse.innerHTML = xhr.responseText;
            };
            userId.value = '';
            firstName.value = '';
            lastName.value = '';
            emailAddress.value = '';
            password.value = '';
        }
    });
    _DELETEButton.addEventListener('click', () => {
        const userId = _DELETEModule.querySelector('.user-id');
        if (userId.value) {
            const xhr = new XMLHttpRequest();
            xhr.open('DELETE', 'http://localhost:3000/users/' + userId.value, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                userId: userId.value,
            }));
            xhr.onload = () => {
                console.log(xhr.responseText);
                _DELETEResponse.innerHTML = (xhr.status === 204 ? 'User Deleted' : xhr.responseText);
            };
            userId.value = '';
        }
    });
    return {};
})();
//# sourceMappingURL=index.js.map