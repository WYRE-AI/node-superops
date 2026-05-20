/**
 * Knowledge Base types for the SuperOps MSP API.
 *
 * Field names mirror the SuperOps GraphQL `KbItem` type. See SCHEMA.md for the
 * schema reference these were derived from.
 */

/** Item type for knowledge base items. */
export type KbItemType = 'KB_COLLECTION' | 'KB_ARTICLE';

/** Article type enumeration. NOTE: unverified against live API */
export type KbArticleType = 'INSTRUCTION' | 'TROUBLESHOOTING' | 'FAQ' | 'GENERAL';

/** Article status enumeration. NOTE: unverified against live API */
export type KbArticleStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

/** Reference to a parent KB item. */
export interface KbParentRef {
  itemId: string;
  name: string;
}

/** Reference to a user who created or modified a KB item. */
export interface KbUserRef {
  userId: string;
  name: string;
}

/** Document sharing/visibility details. NOTE: unverified against live API */
export interface KbDocumentSharedDetails {
  shared: boolean;
  sharedWith?: string[];
}

/**
 * A SuperOps knowledge base item (article or collection).
 */
export interface KbItem {
  /** Unique KB item identifier. */
  itemId: string;
  name: string;
  parent?: KbParentRef;
  itemType: KbItemType;
  description?: string;
  status?: KbArticleStatus;
  createdBy?: KbUserRef;
  createdOn?: string;
  lastModifiedBy?: KbUserRef;
  lastModifiedOn?: string;
  viewCount?: number;
  articleType?: KbArticleType;
  visibility?: KbDocumentSharedDetails;
  loginRequired?: boolean;
}

/**
 * Input for creating a knowledge base article.
 * NOTE: Field names are unverified against live API
 */
export interface KbCreateArticleInput {
  name: string;
  description?: string;
  parentId?: string;
  articleType?: KbArticleType;
  status?: KbArticleStatus;
  visibility?: KbDocumentSharedDetails;
  loginRequired?: boolean;
}

/**
 * Input for updating a knowledge base article.
 * NOTE: Field names are unverified against live API
 */
export interface KbUpdateArticleInput {
  itemId: string;
  name?: string;
  description?: string;
  parentId?: string;
  articleType?: KbArticleType;
  status?: KbArticleStatus;
  visibility?: KbDocumentSharedDetails;
  loginRequired?: boolean;
}

/**
 * Input for deleting a knowledge base article.
 * NOTE: Field names are unverified against live API
 */
export interface KbDeleteArticleInput {
  itemId: string;
}

/**
 * Input for creating a knowledge base collection.
 * NOTE: Field names are unverified against live API
 */
export interface KbCreateCollectionInput {
  name: string;
  description?: string;
  parentId?: string;
}

/**
 * Input for updating a knowledge base collection.
 * NOTE: Field names are unverified against live API
 */
export interface KbUpdateCollectionInput {
  itemId: string;
  name?: string;
  description?: string;
  parentId?: string;
}

/**
 * Input for deleting a knowledge base collection.
 * NOTE: Field names are unverified against live API
 */
export interface KbDeleteCollectionInput {
  itemId: string;
}
