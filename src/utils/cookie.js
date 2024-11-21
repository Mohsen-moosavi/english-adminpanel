const setCookie = (name, value, sec) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + sec * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;`;
};

const getCookie = (name) => {
  const cookieValue = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(name))
    ?.split("=")[1];

  return cookieValue ? decodeURIComponent(cookieValue) : null;
};

const deleteCookie = (name) => {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};
export { setCookie, getCookie, deleteCookie };
