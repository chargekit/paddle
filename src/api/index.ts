import type { PaddleAPI } from "./types";

export function client<DataDef extends PaddleAPI.CustomDataDef>(
  key: string,
  sandbox?: boolean
): PaddleAPI.Client<DataDef> {
  return { key, sandbox };
}

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
 * @param query - the query
 * @returns list of products
 */
export function listProducts<
  DataDef extends PaddleAPI.CustomDataDef,
  Include extends PaddleAPI.QueryProductsListInclude | undefined
>(
  client: PaddleAPI.Client<DataDef>,
  query?: PaddleAPI.QueryProductsList<Include>
): Promise<PaddleAPI.ResponseProductsList<DataDef, Include>> {
  return paddleFetch(client, {
    method: "GET",
    path: "products" + prepareQuery(query),
  });
}

interface PaddleFetchProps {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
}

async function paddleFetch(
  client: PaddleAPI.Client<PaddleAPI.CustomDataDef>,
  props: PaddleFetchProps
) {
  const response = await fetch(
    (client.sandbox ? sandboxAPIURL : apiURL) + props.path,
    {
      method: props.method,
      headers: {
        Authorization: `Bearer ${client.key}`,
      },
    }
  );
  return response.json();
}

const apiURL = `https://api.paddle.com/`;

const sandboxAPIURL = `https://sandbox-api.paddle.com/`;

function prepareQuery(query: Object | undefined): string {
  const q = new URLSearchParams();

  query &&
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined) return;

      if (Array.isArray(value)) {
        const str = value.filter((item) => item !== undefined).join(",");
        q.append(key, str);
      } else {
        q.append(key, value.toString());
      }
    });

  return q.size === 0 ? "" : "?" + q.toString();
}
