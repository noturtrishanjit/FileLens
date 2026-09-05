const path = require('path');
const os = require('os');

const APP_NAME = 'FileLens';
const DB_NAME = 'filelens.db';

const DEFAULT_LOCATIONS = [
  path.join(os.homedir(), 'Desktop'),
  path.join(os.homedir(), 'Documents'),
  path.join(os.homedir(), 'Downloads'),
  path.join(os.homedir(), 'Pictures'),
  path.join(os.homedir(), 'Videos'),
];

const SUPPORTED_EXTENSIONS = {
  images: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp', '.ico', '.tiff'],
  videos: ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.m4v'],
  audio: ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.wma', '.m4a'],
  documents: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.rtf', '.odt', '.csv'],
  code: ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.h', '.cs', '.go', '.rs', '.html', '.css', '.json', '.xml', '.yaml', '.yml', '.md'],
  archives: ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2'],
};

const FILE_CATEGORIES = {};
for (const [category, exts] of Object.entries(SUPPORTED_EXTENSIONS)) {
  for (const ext of exts) {
    FILE_CATEGORIES[ext] = category;
  }
}

const RELATIONSHIP_TYPES = ['related', 'source', 'export', 'version', 'attachment', 'reference', 'copy'];

module.exports = { APP_NAME, DB_NAME, DEFAULT_LOCATIONS, SUPPORTED_EXTENSIONS, FILE_CATEGORIES, RELATIONSHIP_TYPES };
