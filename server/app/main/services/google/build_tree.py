def get_files(service):
    """Get files with use of provided service."""
    files = []
    page_token = None
    while True:
        results = (
            service.files()
            .list(
                pageSize=1000,
                q="trashed = false and 'me' in owners",
                fields="nextPageToken, files(id, mimeType, name, parents, ownedByMe)",
                # fields="nextPageToken, files(id, name, mimeType, thumbnailLink, iconLink, webViewLink, parents)",
                corpora="user",
                # includeItemsFromAllDrives=False,
                # supportsAllDrives=True,
                pageToken=page_token,
            )
            .execute()
        )
        files.extend(results.get("files", []))
        page_token = results.get("nextPageToken", None)
        if not page_token:
            break
    return files


tree = []


def build_tree_v2(files, parent_id):
    """Recursevly builds a file tree structure."""
    print('building tree')

    def sort_files(row):
        folders = []
        for i, f in enumerate(row):
            if f["mimeType"] == "application/vnd.google-apps.folder":
                folder = row.pop(i)
                folders.append(folder)
        folders.sort(key=lambda f: f["name"])
        row.sort(key=lambda f: f["name"])
        return folders + row

    files_sorted = sort_files(files)

    def get_row(parent_id):
        row = []

        for f in files_sorted:
            parents = f.get("parents")
            if not parents:
                row.append(f)
                continue
            if parent_id in parents:
                if f.get("mimeType") == "application/vnd.google-apps.folder":
                    f["children"] = get_row(f["id"])
                row.append(f)

        return row
    print('building tree finished')
    tree = get_row(parent_id)
    return tree
