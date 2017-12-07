export async function request(
  url,
  method = 'GET',
  data,
  option = {
    method,
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  },
) {
  const response = await fetch(url, option),
    json = await response.json()
  return { response, data: json }
}
