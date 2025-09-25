# def list_row(service, parent_id):
#     """Request files from Google Drive API service with "parent_id" among its parents' id's."""
#     results = (
#         service.files()
#         .list(
#             q=f"'{parent_id}' in parents and trashed=false",
#             fields="files(id, name, mimeType, thumbnailLink, iconLink, webViewLink, parents)",
#         )
#         .execute()
#     )
#     return results.get("files", [])


# def build_tree(service, parent_id="root"):
#     """Recursevly builds a file tree structure."""
#     row = list_row(service, parent_id)
#     tree = []
#     for f in row:
#         node = {
#             "id": f["id"],
#             "name": f["name"],
#             "mimeType": f["mimeType"],
#             # "thumbnailLink": f["thumbnailLink"],
#             "iconLink": f["iconLink"],
#             "webViewLink": f["webViewLink"],
#             "parents": f["parents"],
#         }
#         if f["mimeType"] == "application/vnd.google-apps.folder":
#             f["children"] = build_tree(service, f["id"])
#         tree.append(node)

#     return tree


def get_files(service):
    results = (
        service.files()
        .list(
            pageSize=1000,
            q=f"trashed=false",
            fields="files(id, name, mimeType, thumbnailLink, iconLink, webViewLink, parents)",
        )
        .execute()
    )
    return results.get("files", [])


tree = []


def build_tree_v2(files, parent_id="root"):
    """Recursevly builds a file tree structure."""

    def get_row(parent_id):
        row = []

        for f in files:
            parents = f.get("parents")
            if not parents:
                row.append(f)
                continue
            if parent_id in parents:
                if f.get("mimeType") == "application/vnd.google-apps.folder":
                    f["children"] = get_row(f["id"])
                row.append(f)
        return row

    tree = get_row(parent_id)
    return tree
