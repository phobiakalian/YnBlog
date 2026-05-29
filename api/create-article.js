/**
 * Vercel Edge Function - Create New Article
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
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
    
    // Validate required fields
    const { title, excerpt, content, author, category } = body;
    if (!title || !excerpt || !content || !author || !category) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Generate ID and timestamps
    const id = `art-${Date.now()}`;
    const now = new Date().toISOString();
    
    // Insert article into database
    const result = await sql`
      INSERT INTO articles (
        id,
        title,
        excerpt,
        content,
        author,
        author_avatar,
        category,
        tags,
        image_url,
        published_at,
        updated_at,
        views,
        status
      ) VALUES (
        ${id},
        ${title},
        ${excerpt},
        ${content},
        ${author},
        ${body.authorAvatar || ''},
        ${category},
        ${JSON.stringify(body.tags || [])},
        ${body.imageUrl || ''},
        ${now},
        ${now},
        0,
        ${body.status || 'published'}
      )
      RETURNING *
    `;

    const article = result.rows[0];

    return new Response(
      JSON.stringify({ 
        success: true,
        article: {
          ...article,
          tags: typeof article.tags === 'string' ? JSON.parse(article.tags) : article.tags
        }
      }),
      { 
        status: 201,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  } catch (error) {
    console.error('Error creating article:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to create article',
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
