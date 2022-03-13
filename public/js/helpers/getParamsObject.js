const getParamsObject = () => {
  return new Proxy(new URLSearchParams(location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
};

export default getParamsObject;
