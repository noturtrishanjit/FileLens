FILELENS — PRODUCT REQUIREMENTS DOCUMENT

1. Product Overview

Product Name: FileLens
Platform: Windows 10 / Windows 11
Product Type: Visual File Management & Discovery Application
Primary Goal: Replace the traditional folder-first file-browsing experience with a visual, intelligent, project-oriented workspace.

Core Concept

FileLens transforms the traditional:

"C:\Users\Username\Documents\Project\..."

experience into a visual system:

Projects → School → Class 10 → Projects → Java

Files remain stored normally on the user's computer. FileLens simply provides a smarter visual layer for discovering, organizing, searching, previewing, and managing them.

Product Philosophy

«Your files shouldn't make you understand the filesystem. The filesystem should understand your files.»

FileLens should feel:

- Fast
- Minimal
- Visual
- Professional
- Native to Windows
- Extremely easy to navigate
- Powerful for advanced users
- Simple enough for beginners

---

2. Problem Statement

Windows File Explorer is fundamentally based around folders and paths.

Users frequently struggle with:

- Forgetting where a file was saved
- Large Downloads folders
- Duplicate files
- Multiple versions of the same document
- Deep folder structures
- Finding files based on what they remember rather than the filename
- Identifying files visually
- Managing large project folders
- Switching between multiple Explorer windows
- Understanding relationships between files

For example, a user may remember:

«"I made that school project PDF sometime last month."»

But they may not remember:

"C:\Users\...\Documents\School\Projects\Class10\English\Final\Version2\"

FileLens should allow:

«Search → school project PDF»

and immediately surface the relevant files.

---

3. Target Users

Primary Users

Students

Need to manage:

- Assignments
- PDFs
- Notes
- Projects
- Presentations
- Images
- Videos
- Code

Developers

Need:

- Project organization
- Code navigation
- Git repositories
- Build files
- Documentation
- Assets

Creators

Need:

- Videos
- Images
- Audio
- Project files
- Exported versions

Professionals

Need:

- Documents
- Work projects
- Presentations
- Spreadsheets
- Client files

Power Users

Need:

- Advanced search
- Tags
- File relationships
- Automation
- Bulk management

---

4. Product Goals

Primary Goals

1. Make files easier to discover.
2. Reduce dependence on folder navigation.
3. Provide powerful visual previews.
4. Provide extremely fast search.
5. Allow users to organize files using tags and collections.
6. Make projects easier to manage.
7. Preserve the user's existing filesystem.
8. Never lock users into FileLens.
9. Provide a beautiful modern Windows UI.
10. Remain fast even with hundreds of thousands of files.

Non-Goals

FileLens should NOT initially:

- Replace Windows' underlying filesystem.
- Move every user's files automatically.
- Upload files to the cloud.
- Require an online account.
- Require AI to perform basic file management.
- Force users to reorganize their existing folders.

---

5. Core Experience

Traditional Explorer

C:
└── Users
    └── User
        └── Documents
            └── School
                └── Projects
                    └── Final

FileLens

FILELENS

Projects
 ├── School
 │    ├── English
 │    ├── Java
 │    ├── Physics
 │    └── Computer
 │
 ├── Coding
 ├── Video
 └── Personal

The physical location still exists.

FileLens creates a visual organizational layer on top.

---

6. Main Dashboard

The dashboard should immediately show:

Header

FileLens                         🔍 Search files...

+ New Collection     + Tag

Main Areas

Good morning

RECENT
────────────────────────────────

[Project.pdf] [Photo.png] [Code.zip] [Video.mp4]

────────────────────────────────

YOUR SPACES

📚 School
💻 Coding
🎬 Videos
🎨 Design
📦 Downloads
📁 Documents

────────────────────────────────

RECENTLY MODIFIED

...

---

7. Navigation

Left sidebar:

⌂ Home

⭐ Favorites

🕘 Recent

📁 Files

🏷 Tags

📚 Collections

🔗 Related

🗑 Trash

────────────────

LOCATIONS

💻 This PC
📥 Downloads
📄 Documents
🖼 Pictures
🎬 Videos
🖥 Desktop

────────────────

⚙ Settings

The sidebar must be collapsible.

---

8. Visual File Cards

Files should be displayed as cards rather than only rows.

Example:

┌───────────────────────┐
│                       │
│      PDF PREVIEW      │
│                       │
│                       │
├───────────────────────┤
│ Physics Project.pdf   │
│ PDF • 12 MB           │
│ Modified 2h ago       │
└───────────────────────┘

Different file types should receive specialized previews.

Images

Show actual image.

Videos

Show thumbnail + duration.

PDFs

Show first-page preview.

Documents

Show document preview.

Code

Show syntax-highlighted preview.

Audio

Show waveform or album artwork when available.

Archives

Show archive contents summary.

---

9. View Modes

Users can switch between:

Grid

Large visual cards.

Compact Grid

Smaller cards.

List

Traditional file list.

Gallery

Large previews optimized for images/videos.

Timeline

Files organized chronologically.

Example:

SEPTEMBER 2026

Sep 4
 ├── Project.pdf
 ├── Screenshot.png

Sep 3
 ├── Presentation.pptx

Sep 1
 ├── Video.mp4

---

10. Smart Search

Search should be one of FileLens' most important features.

Users can search:

Filename

«physics.pdf»

Extension

«.pdf»

Type

«videos»

Date

«modified yesterday»

Size

«files larger than 500MB»

Location

«downloads»

Tags

«#school»

Combined

«PDFs modified this week in School»

---

11. Natural-Language Search

Optional advanced search:

«"Find the presentation I edited last Friday."»

«"Show large videos in Downloads."»

«"Find images related to my school project."»

«"Show files I haven't opened in six months."»

The system should convert natural-language requests into safe filesystem queries.

Important:

Natural-language search must never modify, delete, move, or overwrite files without explicit confirmation.

---

12. Universal Search

Search should index:

- Filename
- Extension
- Folder
- Metadata
- File contents where supported
- Tags
- Creation date
- Modification date
- File size

Examples:

presentation

could return:

Physics Presentation.pptx
Physics Presentation.pdf
Physics Presentation Final.pptx
Presentation Assets.zip

---

13. Tags

Users can assign tags:

#school
#important
#project
#coding
#personal
#work

Tags should support custom colors/icons.

Example:

Physics Project.pdf

#school
#physics
#important

Users can filter by multiple tags.

---

14. Collections

Collections are virtual groups.

A file can belong to multiple collections without being duplicated or physically moved.

Example:

Collection:
CLASS 10 PROJECT

Contains:

📄 English Project.pdf
📄 Java Project.java
📊 Physics Presentation.pptx
🖼 Project Diagram.png
🎬 Presentation.mp4

The files can remain in completely different physical folders.

---

15. Smart Collections

FileLens can provide automatic collections:

Recently Added

Files created recently.

Large Files

Largest files on the computer.

Screenshots

Detected screenshots.

Downloads

Recently downloaded content.

Documents

Documents detected across locations.

Unused Files

Files not accessed for a long time.

Duplicates

Potential duplicates.

Users can disable any smart collection.

---

16. File Relationships

This is one of FileLens' signature features.

FileLens should visually represent relationships between files.

Example:

       Physics Project.pdf
              │
       ┌──────┼──────┐
       ↓      ↓      ↓
   Diagram   Data   Presentation
    .png     .xlsx      .pptx

Users can manually create relationships.

Possible relationship types:

- Related
- Source
- Export
- Version
- Attachment
- Reference
- Copy

---

17. Project Mode

A project can become a dedicated workspace.

Example:

SCHOOL PROJECT

Overview

Files: 24
Size: 1.8 GB
Last modified: Today

FILES

📄 Report.pdf
📊 Data.xlsx
🎨 Cover.png
📑 References.docx
🎬 Presentation.mp4

RELATED

🔗 Research
🔗 Images
🔗 Previous versions

---

18. File Details Panel

Selecting a file opens a detailed information panel.

Physics Project.pdf

Preview

Type
PDF Document

Size
12.4 MB

Created
Aug 21, 2026

Modified
Sep 4, 2026

Location
Documents / School / Physics

Tags
#school
#physics
#project

Related Files
3

Actions
Open
Rename
Move
Copy
Share
Delete
Properties

---

19. Quick Preview

Press:

Space

to preview a selected file without opening its full application.

Preview should support:

- Images
- PDFs
- Videos
- Audio
- Text
- Code
- Common Office documents where technically feasible

---

20. File Operations

FileLens must support standard operations:

- Open
- Open with
- Copy
- Cut
- Paste
- Rename
- Move
- Duplicate
- Delete
- Restore
- Share
- Compress
- Extract
- Create shortcut
- Properties

Operations should use Windows filesystem APIs where possible.

---

21. Drag & Drop

Drag files between:

- Collections
- Folders
- Tags
- Projects
- Desktop
- Windows Explorer

Dragging a file into a collection should not automatically move the physical file.

The UI should clearly distinguish:

Add to Collection

from

Move File

---

22. Duplicate Finder

FileLens should identify potential duplicates using:

1. Filename similarity
2. File size
3. Hash comparison

Example:

POTENTIAL DUPLICATES

IMG_2048.png
IMG_2048 (1).png
IMG_2048-copy.png

Size: 4.8 MB
Hash: Same

Users must explicitly choose what to delete.

No automatic destructive cleanup.

---

23. Storage Analyzer

Visual storage map:

STORAGE

512 GB

Applications      148 GB
Videos            92 GB
Documents         24 GB
Images            18 GB
Downloads         15 GB
Other             31 GB

Clicking a category drills down into its largest folders/files.

---

24. Timeline

Files can be viewed chronologically.

TODAY

10:42
Physics.pdf

09:31
Project.png

08:15
Presentation.pptx

YESTERDAY

...

Timeline filters:

- Created
- Modified
- Accessed

---

25. Recent Activity

Show meaningful activity:

RECENT

You modified:
Physics Project.pdf

You opened:
Presentation.pptx

New:
Screenshot.png

Moved:
Project Assets/

FileLens should avoid excessive activity logging.

---

26. Favorites

Users can pin:

- Files
- Folders
- Collections
- Projects

Favorites appear in the sidebar.

---

27. Desktop Integration

Optional integrations:

Context Menu

Right-click:

Open in FileLens
Add to FileLens Collection
Add Tag

Send To

Send to FileLens

Default File Explorer Integration

Users may optionally configure FileLens to handle supported navigation scenarios.

Do not force replacement of Explorer.

---

28. Keyboard Shortcuts

Important shortcuts:

Ctrl + K       Search
Ctrl + F       Find
Ctrl + N       New collection
Ctrl + Shift + N
               New folder
Ctrl + C       Copy
Ctrl + X       Cut
Ctrl + V       Paste
F2             Rename
Delete         Delete
Space          Quick Preview
Enter          Open
Ctrl + Z       Undo
Ctrl + Shift + Z
               Redo
Ctrl + 1       Grid
Ctrl + 2       List
Ctrl + 3       Gallery

Shortcuts must be customizable.

---

29. Global Quick Launcher

Optional:

Alt + Space

opens FileLens Quick Search.

Example:

🔍 Search anything...

physics presentation

Files
Projects
Folders
Collections
Tags

Results should appear instantly.

---

30. AI Features

AI should be optional rather than required.

Potential AI features:

Semantic Search

«"Find the school project about renewable energy."»

File Summaries

Summarize a selected document.

Automatic Tag Suggestions

Example:

Suggested tags:

#school
#physics
#project

[Apply]

Project Detection

FileLens can suggest:

«"These 8 files appear to belong to the same project."»

User must approve.

Important Privacy Rule

AI processing should preferably happen locally.

If cloud AI is added:

- Explicit opt-in
- Clear disclosure
- No automatic file uploads
- User-controlled provider/API configuration

---

31. Offline-First Architecture

Core FileLens functionality must work without internet.

Internet should NOT be required for:

- Browsing
- Searching
- Previewing
- Tagging
- Collections
- File operations
- Duplicate detection
- Storage analysis

---

32. Data Model

FileLens should maintain a local metadata database.

Example entities:

File

id
path
name
extension
size
createdAt
modifiedAt
accessedAt
hash
thumbnail

Tag

id
name
icon
color

Collection

id
name
description
createdAt

Relationship

sourceFile
targetFile
relationshipType

FileTag

fileId
tagId

CollectionFile

collectionId
fileId

The database stores metadata and relationships—not duplicate copies of the user's files.

---

33. Recommended Technology Stack

Desktop Framework

Preferred:

C# + .NET + WinUI 3

Reason:

- Native Windows experience
- Good Windows API access
- Strong filesystem integration
- Modern UI
- Better performance than a heavy web wrapper for this use case

Alternative:

C++ + WinUI

for highly performance-critical components.

Web technologies can be used for selected components, but the core file-management engine should remain native.

---

34. Local Database

Recommended:

SQLite

Use it for:

- File metadata
- Tags
- Collections
- Relationships
- Search indexes
- Settings

---

35. Search Engine

For MVP:

SQLite FTS5

For larger installations:

A dedicated local indexing/search architecture may be introduced.

Search must remain responsive with very large file libraries.

---

36. File Indexing

FileLens should scan only user-selected locations.

Default locations:

- Desktop
- Documents
- Downloads
- Pictures
- Videos

Users can add:

+ Add Location

The indexer should:

- Run in the background
- Detect changes
- Avoid unnecessary rescanning
- Respect battery/performance settings
- Support Windows filesystem change notifications

---

37. Performance Requirements

Target:

Startup

Under 2 seconds on a modern SSD system.

Search

Common searches should return results in approximately sub-second time after indexing.

UI

Target smooth scrolling and interaction at approximately 60 FPS.

Large Libraries

The application should remain usable with:

500,000+ indexed files

where practical.

Thumbnail generation should happen asynchronously.

---

38. Privacy & Security

FileLens should be:

Local-first

User files stay on the user's machine unless the user explicitly chooses otherwise.

No mandatory account

Users should be able to use FileLens without registration.

No automatic cloud upload

Never upload files silently.

Permissions

Request access only when necessary.

Sensitive locations

Users can exclude:

- Folders
- Drives
- File types

from indexing.

---

39. Backup & Recovery

FileLens metadata should be exportable.

Users can export:

FileLens Backup

containing:

- Collections
- Tags
- Relationships
- Preferences

The backup should not need to contain the actual files.

If files are moved externally, FileLens should attempt to detect their new location.

---

40. Undo System

Destructive operations should support undo where possible.

Example:

Moved 12 files to Projects

[Undo]

Deletion should preferably move files to the Windows Recycle Bin rather than permanently delete them.

---

41. Themes

Support:

- Light
- Dark
- System

Optional accent colors.

UI should use:

- Glass-like surfaces where appropriate
- Soft depth
- Subtle shadows
- Smooth transitions
- Clear typography
- Minimal visual clutter

Avoid excessive glassmorphism that reduces readability or performance.

---

42. Accessibility

Support:

- Keyboard navigation
- Screen readers
- High contrast
- Adjustable text size
- Reduced motion
- Clear focus indicators

---

43. MVP

The first public version should NOT attempt to build everything.

MVP Features

Core

- Windows filesystem browsing
- File indexing
- Fast search
- Grid/List views
- Image previews
- PDF previews
- File details
- Basic file operations
- Tags
- Collections
- Favorites
- Recent files
- Dark/Light themes
- Keyboard shortcuts
- Storage analyzer
- Duplicate detection

Exclude from MVP

- Cloud synchronization
- Social features
- Complex AI
- Cross-device sync
- Advanced automation
- Full Explorer replacement

---

44. Version 1.1

Add:

- Timeline
- Gallery
- Better document previews
- Smart collections
- File relationships
- Project workspaces
- Advanced search filters
- Improved duplicate detection

---

45. Version 1.5

Add:

- Semantic search
- Optional local AI
- Automatic project suggestions
- Advanced storage analytics
- Saved searches
- Custom dashboards
- More file formats

---

46. Version 2.0

Potential major features:

FileLens Sync

Optional encrypted synchronization of metadata across PCs.

FileLens Mobile Companion

Android app for browsing/searching your PC remotely, with explicit pairing and permissions.

FileLens Automations

Example:

«When a new PDF appears in Downloads, tag it as "Documents."»

Smart Workspaces

Automatically prepare a project workspace containing related files.

---

47. Monetization

Free

- Unlimited local browsing
- Search
- Tags
- Collections
- Basic previews
- Favorites
- Storage analysis

Pro

Potential price:

$19–39/year

or a one-time purchase.

Pro features:

- Advanced semantic search
- Advanced duplicate analysis
- Project intelligence
- Advanced automation
- Cross-device metadata sync
- Custom workspaces
- Advanced storage analytics

Avoid locking basic file management behind a subscription.

---

48. Competitive Positioning

FileLens should NOT market itself simply as:

«"A better File Explorer."»

Instead:

«"A visual workspace for everything on your PC."»

Traditional Explorer:

Folders → Files

FileLens:

Projects → Collections → Relationships → Files

---

49. Key Differentiator

The defining feature should be:

FILE GRAPH

Users can visualize how their files relate.

Example:

                SCHOOL PROJECT
                      │
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
     Research       Assets       Final
        │             │             │
      PDF         Images       Presentation
                                   │
                                  Video

This transforms FileLens from a pretty file browser into an actual file knowledge system.

---

50. Viral / Marketing Hook

The marketing should focus on the experience.

Short-form video concept

Show:

Windows Explorer:

C:
 > Users
 > User
 > Documents
 > School
 > Projects
 > Class 10
 > Physics

Then cut to:

FILELENS

🔬 PHYSICS PROJECT

[Research.pdf]
[Diagram.png]
[Data.xlsx]
[Presentation.pptx]
[Final.pdf]

Caption:

«"Stop searching through folders."»

Another hook:

«"Your files aren't messy. Your file system is."»

---

51. Success Metrics

Activation

Percentage of users who successfully index their first location.

Target:

>70%

Search Usage

Percentage of active users using search weekly.

Target:

>60%

Retention

30-day retention target:

>25% for the initial consumer product.

Performance

Median search response:

<500 ms for indexed metadata searches.

Crash Rate

Target:

<0.5% sessions

---

52. Risks

Risk 1: Windows already has File Explorer

Solution

Don't compete on basic folder browsing.

Compete on:

- Discovery
- Search
- Visualization
- Relationships
- Projects
- Organization

---

Risk 2: Indexing can consume resources

Solution

- Background indexing
- Configurable indexing
- Exclusions
- CPU/battery-aware scanning

---

Risk 3: Users don't want to reorganize files

Solution

Make FileLens virtual-first.

Collections and tags shouldn't require moving files.

---

Risk 4: AI privacy concerns

Solution

AI is optional and local-first.

---

53. User Flow

First Launch

Welcome to FileLens

Your files stay on your PC.

Choose locations to index:

☑ Documents
☑ Downloads
☑ Pictures
☑ Desktop
☐ Videos

[Continue]

FileLens begins indexing.

Then:

Your FileLens is ready.

12,842 files indexed.

[Explore Files]

---

54. Example User Journey

User searches:

«"Physics project"»

