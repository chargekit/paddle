import { Paddle } from "../types";
import type { PaddleAPI } from "./types";

/**
 * Creates a Paddle API client.
 *
 * @param key - the Paddle key
 * @param sandbox - if to use the sandbox API
 *
 * @returns the Paddle API client
 */
export function client<DataDef extends PaddleAPI.CustomDataDef>(
  key: string,
  sandbox?: boolean
): PaddleAPI.Client<DataDef> {
  return { key, sandbox };
}

/**
 * The Paddle API request props.
 */
export interface PaddleFetchProps {
  /** The request method */
  method: "GET" | "POST" | "PATCH" | "DELETE";
  /** The API path */
  path: string;
  /** The request query */
  query?: Object | undefined;
  /** The request body */
  body?: Object;
}

/**
 * Sends a request to the Paddle API.
 *
 * @param client - the Paddle API client
 * @param props - the fetch props
 *
 * @returns promise to the response
 */
export async function paddleFetch(
  client: PaddleAPI.Client<PaddleAPI.CustomDataDef>,
  props: PaddleFetchProps
) {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${client.key}`,
  };

  if (props.body) headers["Content-Type"] = "application/json";

  const queryStr = props.query ? prepareQuery(props.query) : "";
  const url = (client.sandbox ? sandboxAPIURL : apiURL) + props.path + queryStr;

  const response = await fetch(url, {
    method: props.method,
    headers,
    body: props.body ? JSON.stringify(props.body) : null,
  });
  return response.json();
}

/// Products

/**
 * Returns a paginated list of products. Use the query parameters to page
 * through results.
 *
 * By default, Paddle returns products that are active. Use the status query
 * parameter to return products that are archived.
 *
 * Use the include parameter to include related price entities in the response.
 *
 * @param client - the Paddle API client
 * @param query - the query parameters to filter the list of products
 *
 * @returns list of products
 */
export function listProducts<
  DataDef extends PaddleAPI.CustomDataDef,
  Include extends PaddleAPI.ProductResponseInclude | undefined
>(
  client: PaddleAPI.Client<DataDef>,
  query?: PaddleAPI.ProductsListQuery<Include>
): Promise<PaddleAPI.ProductsListResponse<DataDef, Include>> {
  return paddleFetch(client, {
    method: "GET",
    path: "products",
    query,
  });
}

/**
 * Creates a new product with the specified details.
 *
 * @param client - the Paddle API client
 * @param body - the request body containing the product details
 *
 * @returns the created product
 */
export function createProduct<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  body: PaddleAPI.ProductCreateBody<DataDef>
): Promise<PaddleAPI.ProductCreateResponse<DataDef>> {
  return paddleFetch(client, {
    method: "POST",
    path: "products",
    body,
  });
}

/**
 * Returns a product using its ID.
 *
 * Use the include parameter to include related price entities in the response.
 *
 * @param client - the Paddle API client
 * @param productId - Paddle ID of the product entity to work with
 * @param query - the query
 *
 * @returns the product
 */
export function getProduct<
  DataDef extends PaddleAPI.CustomDataDef,
  Include extends PaddleAPI.ProductInclude | undefined
>(
  client: PaddleAPI.Client<DataDef>,
  productId: Paddle.ProductId,
  query?: PaddleAPI.ProductGetQuery<Include>
): Promise<PaddleAPI.ProductGetResponse<DataDef, Include>> {
  return paddleFetch(client, {
    method: "GET",
    path: "products/" + productId,
    query,
  });
}

/**
 * Update a product with the specified details.
 *
 * @param client - the Paddle API client
 * @param productId - Paddle ID of the product entity to work with
 * @param body - the request body containing the product update details
 *
 * @returns the updated product
 */
export function updateProduct<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  productId: Paddle.ProductId,
  body: PaddleAPI.ProductUpdateBody<DataDef>
): Promise<PaddleAPI.ProductUpdateResponse<DataDef>> {
  return paddleFetch(client, {
    method: "PATCH",
    path: "products/" + productId,
    body,
  });
}

/// Prices

/**
 * Returns a paginated list of prices. Use the query parameters to page through
 * results.
 *
 * By default, Paddle returns prices that are active. Use the status query
 * parameter to return prices that are archived.
 *
 * Use the include parameter to include the related product entity in the response.
 *
 * @param client - the Paddle API client
 * @param query - the query parameters to filter the list of prices
 *
 * @returns list of prices
 */
export function listPrices<
  DataDef extends PaddleAPI.CustomDataDef,
  Include extends PaddleAPI.PriceInclude | undefined
>(
  client: PaddleAPI.Client<DataDef>,
  query?: PaddleAPI.PricesListQuery<Include>
): Promise<PaddleAPI.PricesListResponse<DataDef, Include>> {
  return paddleFetch(client, {
    method: "GET",
    path: "prices",
    query,
  });
}

/**
 * Creates a new price.
 *
 * Prices describe how you charge for products. You must include a product_id
 * in your request to relate this price to a product.
 *
 * If you omit the quantity object, Paddle automatically sets a minimum of 1
 * and a maximum of 100 for you. This means the most units that a customer can
 * buy is 100. Set a quantity if you'd like to offer a different amount.
 *
 * If successful, your response includes a copy of the new price entity.
 *
 * @param client - the Paddle API client
 * @param body - the request body detailing the price settings
 *
 * @returns the created price entity
 */
export function createPrice<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  body: PaddleAPI.PriceCreateBody<DataDef>
): Promise<PaddleAPI.PriceCreateResponse<DataDef>> {
  return paddleFetch(client, {
    method: "POST",
    path: "prices",
    body,
  });
}

/**
 * Returns a price using its ID.
 *
 * Use the include parameter to include the related product entity in
 * the response.
 *
 * @param client - The Paddle API client
 * @param priceId - Paddle ID of the price entity to work with
 * @param query - The query parameters used to filter the results
 *
 * @returns The price entity with included entities
 */
export function getPrice<
  DataDef extends PaddleAPI.CustomDataDef,
  Include extends PaddleAPI.PriceInclude | undefined
>(
  client: PaddleAPI.Client<DataDef>,
  priceId: Paddle.PriceId,
  query?: PaddleAPI.PriceGetQuery<Include>
): Promise<PaddleAPI.PriceGetResponse<DataDef, Include>> {
  return paddleFetch(client, {
    method: "GET",
    path: "prices/" + priceId,
    query,
  });
}

/**
 * Update a price using its ID. If successful, your response includes a
 * copy of the updated price entity.
 *
 * @param client - the Paddle API client
 * @param priceId - Paddle ID of the price entity to work with
 * @param body - The request body containing the price update details
 *
 * @returns The updated price
 */
export function updatePrice<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  priceId: Paddle.PriceId,
  body: PaddleAPI.PriceUpdateBody<DataDef>
): Promise<PaddleAPI.PriceUpdateResponse<DataDef>> {
  return paddleFetch(client, {
    method: "PATCH",
    path: "prices/" + priceId,
    body,
  });
}

/// Discounts

/**
 * Returns a paginated list of discounts. Use the query parameters to page
 * through results.
 *
 * By default, Paddle returns discounts that are active. Use the status query
 * parameter to return discounts that are archived or expired.
 *
 * @param client - the Paddle API client
 * @param query - the query parameters to filter the list of discounts
 *
 * @returns list of discounts
 */
export function listDiscounts<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  query?: PaddleAPI.DiscountsListQuery
): Promise<PaddleAPI.DiscountsListResponse> {
  return paddleFetch(client, {
    method: "GET",
    path: "discounts",
    query,
  });
}

/**
 * Creates a new discount.
 *
 * If successful, your response includes a copy of the new discount entity.
 *
 * @param client - the Paddle API client
 * @param body - The request body for creating the discount
 *
 * @returns The created discount
 */
export function createDiscount<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  body: PaddleAPI.DiscountCreateBody
): Promise<PaddleAPI.DiscountCreateResponse> {
  return paddleFetch(client, {
    method: "POST",
    path: "discounts",
    body,
  });
}

/**
 * Returns a discount using its ID.
 *
 * @param client - the Paddle API client
 * @param discountId - Paddle ID of the discount entity to work with
 *
 * @returns the discount
 */
export function getDiscount<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  discountId: Paddle.DiscountId
): Promise<PaddleAPI.DiscountGetResponse> {
  return paddleFetch(client, {
    method: "GET",
    path: "discounts/" + discountId,
  });
}

/**
 * Updates a discount using its ID.
 *
 * If successful, your response includes a copy of the updated discount entity.
 *
 * @param client - the Paddle API client
 * @param discountId - Paddle ID of the discount entity to work with
 * @param body - the request body containing the discount's new details
 *
 * @returns the updated discount
 */
export function updateDiscount<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  discountId: Paddle.DiscountId,
  body: PaddleAPI.DiscountUpdateBody
): Promise<PaddleAPI.DiscountUpdateResponse> {
  return paddleFetch(client, {
    method: "PATCH",
    path: "discounts/" + discountId,
    body,
  });
}

/**
 * Returns a paginated list of customers. Use the query parameters to page
 * through results.
 *
 * By default, Paddle returns customers that are active. Use the status query
 * parameter to return customers that are archived.
 *
 * Use the include parameter to include related price entities in the response.
 *
 * @param client - the Paddle API client
 * @param query - the query parameters to filter the list of customers
 *
 * @returns list of customers
 */
export function listCustomers<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  query?: PaddleAPI.CustomersListQuery
): Promise<PaddleAPI.CustomersListResponse> {
  return paddleFetch(client, {
    method: "GET",
    path: "customers",
    query,
  });
}

/**
 * Creates a new customer with the specified details.
 *
 * If successful, your response includes a copy of the new customer entity.
 *
 * @param client - the Paddle API client
 * @param body - The request body containing the customer details
 *
 * @returns The created customer
 */
export function createCustomer<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  body: PaddleAPI.CustomerCreateBody
): Promise<PaddleAPI.CustomerCreateResponse> {
  return paddleFetch(client, {
    method: "POST",
    path: "customers",
    body,
  });
}

/**
 * Returns a customer using its ID.
 *
 * @param client - the Paddle API client
 * @param customerId - Paddle ID of the customer entity to work with
 *
 * @returns the customer
 */
export function getCustomer<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  customerId: Paddle.CustomerId
): Promise<PaddleAPI.CustomerGetResponse> {
  return paddleFetch(client, {
    method: "GET",
    path: "customers/" + customerId,
  });
}

/**
 * Update a customer with the specified details.
 *
 * If successful, your response includes a copy of the updated customer entity.
 *
 * @param client - the Paddle API client
 * @param customerId - Paddle ID of the customer entity to work with
 * @param body - the request body containing the customer update details
 *
 * @returns the updated customer
 */
export function updateCustomer<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  customerId: Paddle.CustomerId,
  body: PaddleAPI.CustomerUpdateBody
): Promise<PaddleAPI.CustomerUpdateResponse> {
  return paddleFetch(client, {
    method: "PATCH",
    path: "customers/" + customerId,
    body,
  });
}

/// Addresses

/**
 * Returns a paginated list of addresses for a customer. Use the query parameters to page through results.
 *
 * By default, Paddle returns addresses that are active. Use the status query parameter to return addresses that are
 * archived.
 *
 * @param client - the Paddle API client
 * @param customerId - Paddle ID of the customer entity to work with
 * @param query - The customer's list addresses query
 *
 * @returns list of addresses for a customer
 */
export function listAddresses<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  customerId: Paddle.CustomerId,
  query?: PaddleAPI.AddressListQuery
): Promise<PaddleAPI.AddressListResponse> {
  return paddleFetch(client, {
    method: "GET",
    path: "customers/" + customerId + "/addresses",
    query,
  });
}

/**
 * Creates a new address for a customer.
 *
 * For tax calculation, fraud prevention, and compliance purposes,
 * you must include a postal_code when creating addresses for some countries.
 * For example, ZIP codes in the USA and postcodes in the UK.
 *
 * If successful, your response includes a copy of the new address entity.
 *
 * @param client - the Paddle API client
 * @param customerId - Paddle ID of the customer entity to work with
 * @param body - the request body containing the country code and other details
 *
 * @returns a copy of the new address entity if successful
 */
export function createAddress<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  customerId: Paddle.CustomerId,
  body: PaddleAPI.AddressCreateBody
): Promise<PaddleAPI.AddressCreateResponse> {
  return paddleFetch(client, {
    method: "POST",
    path: "customers/" + customerId + "/addresses",
    body,
  });
}

/**
 * Returns an address for a customer using its ID and related customer ID.
 *
 * @param client - the Paddle API client
 * @param customerId - Paddle ID of the customer entity to work with
 * @param addressId - Paddle ID of the address entity to work with
 *
 * @returns the requested address
 */
export function getAddress<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  customerId: Paddle.CustomerId,
  addressId: Paddle.AddressId
): Promise<PaddleAPI.AddressGetResponse> {
  return paddleFetch(client, {
    method: "GET",
    path: "customers/" + customerId + "/addresses/" + addressId,
  });
}

/**
 * Update an address for a customer using its ID and related customer ID.
 *
 * If successful, your response includes a copy of the updated address entity.
 *
 * @param client - the Paddle API client
 * @param customerId - Paddle ID of the customer entity to work with
 * @param addressId - Paddle ID of the address entity to work with
 * @param body - the request body containing the address update details
 *
 * @returns the updated address
 */
export function updateAddress<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  customerId: Paddle.CustomerId,
  addressId: Paddle.AddressId,
  body: PaddleAPI.AddressUpdateBody
): Promise<PaddleAPI.AddressUpdateResponse> {
  return paddleFetch(client, {
    method: "PATCH",
    path: "customers/" + customerId + "/addresses/" + addressId,
    body,
  });
}

/**
 * Returns a paginated list of businesses for a customer.
 * Use the query parameters to page through results.
 *
 * By default, Paddle returns businesses that are active.
 * Use the status query parameter to return businesses that are archived.
 *
 * @param client - the Paddle API client
 * @param path - the path parameters to filter the list of businesses
 * @param query - the query parameters to filter the list of businesses
 *
 * @returns list of businesses for a customer
 */
export function listBusinesses<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  customerId: Paddle.CustomerId,
  query?: PaddleAPI.BusinessesListQuery
): Promise<PaddleAPI.BusinessesListResponse> {
  return paddleFetch(client, {
    method: "GET",
    path: "customers/" + customerId + "/businesses",
    query,
  });
}

/**
 * Creates a new business for a customer.
 *
 * If successful, your response includes a copy of the new business entity.
 *
 * @param client - the Paddle API client
 * @param customerId - Paddle ID of the customer entity to work with
 * @param body - The details of the business to be created
 *
 * @returns the created business
 */
export function createBusiness<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  customerId: Paddle.CustomerId,
  body: PaddleAPI.BusinessCreateBody
): Promise<PaddleAPI.BusinessCreateResponse> {
  return paddleFetch(client, {
    method: "POST",
    path: "customers/" + customerId + "/businesses",
    body,
  });
}

/**
 * Returns a business for a customer using its ID and related customer ID.
 *
 * @param client - the Paddle API client
 * @param customerId - Paddle ID of the customer entity to work with
 * @param businessId - Paddle ID of the business entity to work with
 *
 * @returns the business entity
 */
export function getBusiness<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  customerId: Paddle.CustomerId,
  businessId: Paddle.BusinessId
): Promise<PaddleAPI.BusinessGetResponse> {
  return paddleFetch(client, {
    method: "GET",
    path: "customers/" + customerId + "/businesses/" + businessId,
  });
}

/**
 * Update a business for a customer using its ID and related customer ID.
 *
 * If successful, your response includes a copy of the updated business entity.
 *
 * @param client - the Paddle API client
 * @param customerId - Paddle ID of the customer entity to work with
 * @param businessId - Paddle ID of the business entity to work with
 * @param body - the request body containing the business update details
 *
 * @returns The updated business entity or an error response
 */
export function updateBusiness<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  customerId: Paddle.CustomerId,
  businessId: string,
  body: PaddleAPI.BusinessUpdateBody
): Promise<PaddleAPI.BusinessUpdateResponse> {
  return paddleFetch(client, {
    method: "PATCH",
    path: `customers/${customerId}/businesses/${businessId}`,
    body,
  });
}

const apiURL = `https://api.paddle.com/`;

const sandboxAPIURL = `https://sandbox-api.paddle.com/`;

const operatorRegExp = /^(\[(?:GT|GTE|LT|LTE)\])(.*)/;

function prepareQuery(query: Object | undefined): string {
  const q = new URLSearchParams();

  query &&
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined) return;

      if (Array.isArray(value)) {
        const str = value.filter((item) => item !== undefined).join(",");
        return q.append(key, str);
      } else if (key === "include" && value && typeof value === "object") {
        const val = Object.entries(value)
          .filter(([_, val]) => val)
          .map(([key, val]) => key)
          .join(",");
        return q.append(key, val);
      } else if (typeof value === "string") {
        const [_, op, val] = value.match(operatorRegExp) || [];
        if (op && val) return q.append(key + op, val);
      }

      q.append(key, value.toString());
    });

  const qStr = q.toString();
  return qStr ? `?${qStr}` : "";
}
