from collections import defaultdict


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

import time
def build_tree_v2(files, root_id):
    """Recursevly builds a file tree structure."""
    print('building tree')
    root_children = []
    children_map = defaultdict(list)
    for f in files:
        parents = f.get('parents')

        if not parents:
            f["parents"] = [root_id]
            children_map[root_id].append(f)
        else:
            for p in parents:
                children_map[p].append(f)

    children_map[root_id].extend(root_children)

    for key, children in children_map.items():
        children.sort(key=lambda x: (x['mimeType'] !="application/vnd.google-apps.folder", x['name'].lower()))
    def add_children(node_id):
        if node_id in children_map:
            children = children_map[node_id]
            
            for child in children:
                
                if child.get("mimeType") == "application/vnd.google-apps.folder":
                    child["children"] = add_children(child["id"])

            return children
        return []

    
    start_time = time.perf_counter()
    tree = add_children(root_id)
    print('building tree finished')
    end_time = time.perf_counter()
    exec_time = end_time - start_time
    print('building time:',exec_time)
    return tree
