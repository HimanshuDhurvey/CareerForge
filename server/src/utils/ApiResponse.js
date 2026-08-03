'use strict';

/**
 * ApiResponse.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Standardized API response wrapper.
 *
 * All successful controller responses should use this class to guarantee a
 * consistent shape across the entire API surface.
 *
 * Usage:
 *   res.status(200).json(new ApiResponse(200, data, 'User fetched successfully'));
 *
 * Response shape:
 *   {
 *     success    : true,
 *     statusCode : 200,
 *     message    : "User fetched successfully",
 *     data       : { ... }
 *   }
 */

class ApiResponse {
  /**
   * @param {number} statusCode  HTTP status code (e.g. 200, 201, 204)
   * @param {*}      data        Payload to send to the client (object, array, etc.)
   * @param {string} [message='Success']  Optional success message
   */
  constructor(statusCode, data, message = 'Success') {
    this.success    = statusCode < 400;
    this.statusCode = statusCode;
    this.message    = message;
    this.data       = data;
  }
}

module.exports = ApiResponse;
