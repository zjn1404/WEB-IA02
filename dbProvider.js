import { TYPE, BASE_URL, CLASS, ENDPOINT } from "./apiComponents.js";

export const SearchResponse = {
  search: "",
  page: 0,
  per_page: 0,
  total_page: 0,
  total: 0,
  items: [],
};

export const DetailResponse = {
  detail: "",
  item: {},
};

export const GetResponse = {
  get: "",
  page: 0,
  per_page: 0,
  total_page: 0,
  total: 0,
  items: [],
};

export const fetchFromUrl = async (urlString) => {
  try {
    const [path, queryString] = urlString.split("?");
    const [type, dataClass, pattern] = path.split("/");
    const queryParams = new URLSearchParams(queryString);

    let data;

    switch (type) {
      case TYPE.SEARCH:
        data = await handleSearch(dataClass, pattern, queryParams);
        break;
      case TYPE.DETAIL:
        data = await handleDetail(dataClass, pattern);
        break;
      case TYPE.GET:
        data = await handleGet(dataClass, queryParams);
        break;
      default:
        throw new Error(`Unsupported type: ${type}`);
    }

    return data;
  } catch (error) {
    console.error("Error in fetchFromUrl:", error);
    throw error;
  }
};

const handleSearch = async (dataClass, pattern, queryParams) => {
  const data = await fetchAll(dataClass);
  const filteredData = data.filter((item) =>
    item.title?.toLowerCase().includes(pattern.toLowerCase())
  );
  return {
    ...SearchResponse,
    search: pattern,
    page: parseInt(queryParams.get("page")) || 1,
    per_page: parseInt(queryParams.get("per_page")) || 15,
    total_page: Math.ceil(
      filteredData.length / (parseInt(queryParams.get("per_page")) || 15)
    ),
    total: filteredData.length,
    items: applyPagination(filteredData, queryParams),
  };
};

const handleDetail = async (dataClass, pattern) => {
  const data = await fetchAll(dataClass);
  return {
    ...DetailResponse,
    detail: pattern,
    item: data.filter((item) => item.title === pattern),
  };
};

const handleGet = async (dataClass, queryParams) => {
  const data = await fetchAll(dataClass);
  return {
    ...GetResponse,
    get: dataClass,
    page: parseInt(queryParams.get("page")) || 1,
    per_page: parseInt(queryParams.get("per_page")) || 15,
    total_page: Math.ceil(
      data.length / (parseInt(queryParams.get("per_page")) || 15)
    ),
    total: data.length,
    items: applyPagination(data, queryParams),
  };
};

const fetchAll = async (dataClass) => {
  let endpoint = "";
  switch (dataClass) {
    case CLASS.MOVIE:
      endpoint = ENDPOINT.MOVIE;
      break;
    case CLASS.REVIEW:
      endpoint = ENDPOINT.REVIEW;
      break;
    case CLASS.NAME:
      endpoint = ENDPOINT.NAME;
      break;
    case CLASS.TOP50:
      endpoint = ENDPOINT.TOP50;
      break;
    case CLASS.MOST_POPULAR:
      endpoint = ENDPOINT.MOST_POPULAR;
      break;
    default:
      throw new Error(`Unsupported class: ${dataClass}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch data for class: ${dataClass}`);
  }
  return await response.json();
};

const applyPagination = (data, queryParams) => {
  const perPage = parseInt(queryParams.get("per_page")) || 3;
  const page = parseInt(queryParams.get("page")) || 1;

  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  return data.slice(startIndex, endIndex);
};
