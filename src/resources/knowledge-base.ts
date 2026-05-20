/**
 * Knowledge Base resource for the SuperOps MSP API.
 */

import { BaseResource, type BaseResourceOptions } from './base.js';
import { gql } from '../graphql-client.js';
import type {
  KbItem,
  KbCreateArticleInput,
  KbUpdateArticleInput,
  KbDeleteArticleInput,
  KbCreateCollectionInput,
  KbUpdateCollectionInput,
  KbDeleteCollectionInput,
  Page,
  PageParams,
  AsyncIterableWithHelpers,
} from '../types/index.js';

/**
 * GraphQL selection set for a KB item. Fields match the SuperOps `KbItem` type.
 * NOTE: Some field names are unverified against live API
 */
const KB_ITEM_FRAGMENT = gql`
  fragment KbItemFields on KbItem {
    itemId
    name
    parent {
      itemId
      name
    }
    itemType
    description
    status
    createdBy {
      userId
      name
    }
    createdOn
    lastModifiedBy {
      userId
      name
    }
    lastModifiedOn
    viewCount
    articleType
    visibility {
      shared
      sharedWith
    }
    loginRequired
  }
`;

interface GetKbItemResponse {
  getKbItem: KbItem;
}

interface GetKbItemsResponse {
  getKbItems: {
    kbItems: KbItem[];
    listInfo: {
      page: number;
      pageSize: number;
      totalCount: number;
    };
  };
}

interface CreateKbArticleResponse {
  createKbArticle: KbItem;
}

interface UpdateKbArticleResponse {
  updateKbArticle: KbItem;
}

interface DeleteKbArticleResponse {
  deleteKbArticle: boolean;
}

interface CreateKbCollectionResponse {
  createKbCollection: KbItem;
}

interface UpdateKbCollectionResponse {
  updateKbCollection: KbItem;
}

interface DeleteKbCollectionResponse {
  deleteKbCollection: boolean;
}

/**
 * Knowledge Base resource class.
 */
export class KnowledgeBaseResource extends BaseResource {
  constructor(options: BaseResourceOptions) {
    super(options);
  }

  /**
   * Get a single KB item (article or collection) by its item ID.
   */
  async get(itemId: string): Promise<KbItem> {
    const query = gql`
      ${KB_ITEM_FRAGMENT}
      query GetKbItem($input: KBItemIdentifierInput!) {
        getKbItem(input: $input) {
          ...KbItemFields
        }
      }
    `;

    const result = await this.client.query<GetKbItemResponse>(query, {
      input: { itemId },
    });
    return result.getKbItem;
  }

  /**
   * List KB items, one page at a time.
   */
  async list(params?: PageParams): Promise<Page<KbItem>> {
    const query = gql`
      ${KB_ITEM_FRAGMENT}
      query GetKbItems($listInfo: ListInfoInput!) {
        getKbItems(listInfo: $listInfo) {
          kbItems {
            ...KbItemFields
          }
          listInfo {
            page
            pageSize
            totalCount
          }
        }
      }
    `;

    const result = await this.client.query<GetKbItemsResponse>(query, {
      listInfo: {
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 50,
      },
    });

    return {
      items: result.getKbItems.kbItems,
      meta: result.getKbItems.listInfo,
    };
  }

  /**
   * Iterate every KB item, fetching pages on demand.
   */
  listAll(params?: { pageSize?: number }): AsyncIterableWithHelpers<KbItem> {
    return this.createPageListIterator<KbItem>((p) => this.list(p), params?.pageSize);
  }

  /**
   * Create a new knowledge base article.
   */
  async createArticle(input: KbCreateArticleInput): Promise<KbItem> {
    const mutation = gql`
      ${KB_ITEM_FRAGMENT}
      mutation CreateKbArticle($input: CreateKbArticleInput!) {
        createKbArticle(input: $input) {
          ...KbItemFields
        }
      }
    `;

    const result = await this.client.mutate<CreateKbArticleResponse>(mutation, {
      input,
    });
    return result.createKbArticle;
  }

  /**
   * Update an existing knowledge base article.
   */
  async updateArticle(input: KbUpdateArticleInput): Promise<KbItem> {
    const mutation = gql`
      ${KB_ITEM_FRAGMENT}
      mutation UpdateKbArticle($input: UpdateKbArticleInput!) {
        updateKbArticle(input: $input) {
          ...KbItemFields
        }
      }
    `;

    const result = await this.client.mutate<UpdateKbArticleResponse>(mutation, {
      input,
    });
    return result.updateKbArticle;
  }

  /**
   * Delete a knowledge base article.
   */
  async deleteArticle(input: KbDeleteArticleInput): Promise<boolean> {
    const mutation = gql`
      mutation DeleteKbArticle($input: DeleteKbArticleInput!) {
        deleteKbArticle(input: $input)
      }
    `;

    const result = await this.client.mutate<DeleteKbArticleResponse>(mutation, {
      input,
    });
    return result.deleteKbArticle;
  }

  /**
   * Create a new knowledge base collection.
   */
  async createCollection(input: KbCreateCollectionInput): Promise<KbItem> {
    const mutation = gql`
      ${KB_ITEM_FRAGMENT}
      mutation CreateKbCollection($input: CreateKbCollectionInput!) {
        createKbCollection(input: $input) {
          ...KbItemFields
        }
      }
    `;

    const result = await this.client.mutate<CreateKbCollectionResponse>(mutation, {
      input,
    });
    return result.createKbCollection;
  }

  /**
   * Update an existing knowledge base collection.
   */
  async updateCollection(input: KbUpdateCollectionInput): Promise<KbItem> {
    const mutation = gql`
      ${KB_ITEM_FRAGMENT}
      mutation UpdateKbCollection($input: UpdateKbCollectionInput!) {
        updateKbCollection(input: $input) {
          ...KbItemFields
        }
      }
    `;

    const result = await this.client.mutate<UpdateKbCollectionResponse>(mutation, {
      input,
    });
    return result.updateKbCollection;
  }

  /**
   * Delete a knowledge base collection.
   */
  async deleteCollection(input: KbDeleteCollectionInput): Promise<boolean> {
    const mutation = gql`
      mutation DeleteKbCollection($input: DeleteKbCollectionInput!) {
        deleteKbCollection(input: $input)
      }
    `;

    const result = await this.client.mutate<DeleteKbCollectionResponse>(mutation, {
      input,
    });
    return result.deleteKbCollection;
  }
}
