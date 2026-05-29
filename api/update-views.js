/**
 * Vercel Edge Function - Update Article Views
 * 
 * Environment Variables Required:
 * - POSTGRES_URL: Connection string dari Vercel Postgres
 */

import { sql } from '@vercel/postgres';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // Handle CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    const body = await request.json();
    const { articleId } = body;
    
    if (!articleId) {
      return new Response(
        JSON.stringify({ error: 'Article ID required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Increment view count
    const result = await sql`
      UPDATE articles 
      SET views = views + 1, updated_at = NOW()
      WHERE id = ${articleId}
      RETURNING *
    `;

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Article not found' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const article = result.rows[0];

    return new Response(
      JSON.stringify({ 
        success: true,
        article: {
          id: article.id,
          views: article.views
        }
      }),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  } catch (error) {
    console.error('Error updating views:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to update views',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}
