const buttonHandler = (() => {
  // DOM Cache
  const _GETModule: Element = document.querySelector('.GET')!;
  const _POSTModule: Element = document.querySelector('.POST')!;
  const _PATCHModule: Element = document.querySelector('.PATCH')!;
  const _DELETEModule: Element = document.querySelector('.DELETE')!;

  const _GETButton: Element = _GETModule.querySelector('button')!;
  const _POSTButton: Element = _POSTModule.querySelector('button')!;
  const _PATCHButton: Element = _PATCHModule.querySelector('button')!;
  const _DELETEButton: Element = _DELETEModule.querySelector('button')!;

  const _GETResponse: Element = _GETModule.querySelector('.module-response')!;
  const _POSTResponse: Element = _POSTModule.querySelector('.module-response')!;
  const _PATCHResponse: Element = _PATCHModule.querySelector('.module-response')!;
  const _DELETEResponse: Element = _DELETEModule.querySelector('.module-response')!;

  _GETButton.addEventListener('click', () => {
    const userId: HTMLInputElement = _GETModule.querySelector('.user-id')!;

    if (userId.value) {
      const xhr: XMLHttpRequest = new XMLHttpRequest();
      xhr.open('GET', 'http://localhost:3000/Users/' + userId.value, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({
        userId: userId.value,
      }));

      xhr.onload = (): void => {
        console.log(xhr.responseText);
        _GETResponse.innerHTML = xhr.responseText;
      }

      userId.value = '';
    }
  });

  _POSTButton.addEventListener('click', () => {
    const userId: HTMLInputElement = _POSTModule.querySelector('.user-id')!;
    const firstName: HTMLInputElement = _POSTModule.querySelector('.first-name')!;
    const lastName: HTMLInputElement = _POSTModule.querySelector('.last-name')!;
    const emailAddress: HTMLInputElement = _POSTModule.querySelector('.email-address')!;
    const password: HTMLInputElement = _POSTModule.querySelector('.password')!;

    const xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000/Users/', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
      userId: userId.value,
      firstName: firstName.value,
      lastName: lastName.value,
      emailAddress: emailAddress.value,
      password: password.value
    }));

    xhr.onload = (): void => {
      console.log(xhr.responseText);
      _POSTResponse.innerHTML = xhr.responseText;
    }

    userId.value = '';
    firstName.value = '';
    lastName.value = '';
    emailAddress.value = '';
    password.value = '';
  });

  _PATCHButton.addEventListener('click', () => {
    const userId: HTMLInputElement = _PATCHModule.querySelector('.user-id')!;
    const firstName: HTMLInputElement = _PATCHModule.querySelector('.first-name')!;
    const lastName: HTMLInputElement = _PATCHModule.querySelector('.last-name')!;
    const emailAddress: HTMLInputElement = _PATCHModule.querySelector('.email-address')!;
    const password: HTMLInputElement = _PATCHModule.querySelector('.password')!;

    if (userId.value) {
      const xhr: XMLHttpRequest = new XMLHttpRequest();
      xhr.open('PATCH', 'http://localhost:3000/Users/' + userId.value, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({
        firstName: firstName.value,
        lastName: lastName.value,
        emailAddress: emailAddress.value,
        password: password.value
      }));

      xhr.onload = (): void => {
        console.log(xhr.responseText);
        _PATCHResponse.innerHTML = xhr.responseText;
      }

      userId.value = '';
      firstName.value = '';
      lastName.value = '';
      emailAddress.value = '';
      password.value = '';
    }
  });

  _DELETEButton.addEventListener('click', () => {
    const userId: HTMLInputElement = _DELETEModule.querySelector('.user-id')!;

    if (userId.value) {
      const xhr: XMLHttpRequest = new XMLHttpRequest();
      xhr.open('DELETE', 'http://localhost:3000/Users/' + userId.value, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({
        userId: userId.value,
      }));

      xhr.onload = (): void => {
        console.log(xhr.responseText);
        _DELETEResponse.innerHTML = (xhr.status === 204 ? 'User Deleted' : xhr.responseText);
      }

      userId.value = '';
    }
  });

  return {

  }
})();