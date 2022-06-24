import axios from "axios";
import authMethods from "utils/auth";
import { API_URL } from "../settings/config";

class ResponseError extends Error {
  constructor(message) {
    super(message);
    this.name = "";
  }
}

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
  if (response.data.access_token) {
    return response;
  }
  if (response.status === 200) {
    if (response.data?.code === 4 && response.data?.type === "ok") {
      return response.data;
    } else {
      // throw new ResponseError(
      //   response.data?.message
      //     ? response.data?.message
      //     : "Something went wrong."
      // );
      return response;
    }
  } else {
    throw new ResponseError(
      response.data?.message ? response.data?.message : "Something went wrong."
    );
  }
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function handleError(response) {
  const error = response;
  throw error;
}
/**
 * Format query params
 *
 * @param params
 * @returns {string}
 */

const customRequest = axios.create({
  baseURL: API_URL,
  validateStatus: function (status) {
    return (
      (status >= 200 && status < 300) || status === 422 || status === 500 || 400
    );
  },
});

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export default function request(url, options = {}, auth = false) {
  const headers = {
    Accept: "application/json",
  };
  if (!auth) {
    const token = authMethods.getToken();
    if (!token) {
      return null;
    }
    options.headers = {
      Authorization: `Bearer ${token}`,
      ...options.headers,
      ...headers,
    };
  } else {
    options.headers = {
      Authorization: "Basic " + btoa("testjwtclientid2:XY7kmzoNzl100"),
    };
  }
  return customRequest(url, options).then(parseJSON).catch(handleError);
}
