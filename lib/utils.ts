import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for merging tailwind classes
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Format timestamps to readable date
export function formatTimestamp(timestamp: number) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    // Less than 1 minute
    if (diff < 60000) return "Just now";
    // Less than 1 hour
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes} ago`;
    }

    // Less than 24 hours
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours}h ago`;
    }

    // Less than 7 days
    if (diff < 604800000) {
        const days = Math.floor(diff / 86400000);
        return `${days}d ago`;
    }

    // Older - show date
    return date.toLocaleDateString();
}

// Format time for chat messages
export function formatMessageTime(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// Generate a title from first message
export function generateChatTitle (firstMessage: string, maxLength: number = 40) : string {
    const cleaned = firstMessage.trim();
    if (cleaned.length <= maxLength) return cleaned;
    return cleaned.slice(0, maxLength) + "...";
}

// Download Text as File
export function downloadAsFile(content : string,fileName : string,type: 'txt' | 'json' | 'md' = 'txt') {
    const mimeTypes = {
        txt: 'text/plain',
        json: 'application/json',
        md: 'text/markdown'
    }

    const blob = new Blob([content], { type: mimeTypes[type] });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a')
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Copy Text to Clipboard
export async function copyToClipboard(text:string):Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true
    } catch (error) {
        console.error('Failed to copy: ',error)
        return false
    }
}

// Export chat as JSON
export function exportChatAsJSON(message: any[], title: string) {
    const data = {
        title,
        createdAt: new Date().toISOString(),
        messages: message
    }
    downloadAsFile(JSON.stringify(data, null, 2), `${title}.json`, 'json');
}

// Export chat as Markdown
export function exportChatAsMarkdown(messages: any[], title: string) {
    let markdown = `# ${title}\n\n`;
    markdown +=  `*Exported: ${new Date().toLocaleString()}*\n\n---\n\n`;

    messages.forEach((msg: any) => {
        const role = msg.role === 'user' ? '**You**' : '**AI**';
        markdown += `${role}:\n\n${msg.content}\n\n---\n\n`;
    });
    downloadAsFile(markdown, `${title}.md`, 'md');
}