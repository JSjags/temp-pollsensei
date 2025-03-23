export const getNationality = async () => {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  const requestOptions: RequestInit = {
    method: "GET",
    headers: headers,
  };

  const response = await fetch(
    "https://restcountries.com/v3.1/all",
    requestOptions
  );
  const data = await response.json();
  // console.log("Nationalities api response - ", data);
  return data;
};
