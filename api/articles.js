/**
 * Vercel Edge Function - Get Articles from Vercel Postgres
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
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (request.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    // Query articles from Vercel Postgres
    const result = await sql`
      SELECT 
        id,
        title,
        excerpt,
        content,
        author,
        author_avatar as "authorAvatar",
        category,
        tags,
        image_url as "imageUrl",
        published_at as "publishedAt",
        updated_at as "updatedAt",
        views,
        status
      FROM articles
      ORDER BY published_at DESC
    `;

    const articles = result.rows.map(row => ({
      ...row,
      // Parse tags if stored as JSON string
      tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags
    }));

    return new Response(
      JSON.stringify({ 
        articles,
        meta: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          totalArticles: articles.length,
          categories: ['tutorial', 'berita', 'lifestyle', 'opini', 'lainnya']
        }
      }),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
        }
      }
    );
  } catch (error) {
    console.error('Error fetching articles:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch articles',
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
