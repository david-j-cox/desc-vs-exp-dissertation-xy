import { NextResponse } from 'next/server'
import { getServerConfig } from '@/lib/osf-config'
import FormData from 'form-data'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { csvContent, fileName } = data

    const config = getServerConfig()
    
    if (!config.token || !config.projectId) {
      console.error('Missing OSF configuration')
      return NextResponse.json(
        { error: 'OSF configuration is incomplete. Please check the server environment variables.' },
        { status: 500 }
      )
    }

    const nodeId = config.nodeId || config.projectId
    // Using the storage provider endpoint with name parameter
    const endpoint = `https://files.osf.io/v1/resources/${nodeId}/providers/osfstorage/?name=${encodeURIComponent(fileName)}&kind=file`

    // Create buffer from CSV content
    const buffer = Buffer.from(csvContent)

    // Upload to OSF
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Content-Type': 'text/csv',
      },
      body: buffer,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('OSF API Error:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
        endpoint,
      })
      return NextResponse.json(
        { error: errorData.message || 'Failed to upload to OSF' },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in upload route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 