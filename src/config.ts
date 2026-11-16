export const REPO_OWNER = 'pmateos-cisco';
export const REPO_NAME = 'appd-splunk-license-converter';
export const REPO_URL = `https://github.com/${REPO_OWNER}/${REPO_NAME}`;
export const NEW_IDEA_URL = `${REPO_URL}/issues/new?template=feature_request.yml`;
export const IDEAS_LIST_URL = `${REPO_URL}/issues?q=is%3Aissue+label%3Aenhancement`;
export const IDEAS_API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?labels=enhancement&state=all&per_page=15&sort=created&direction=desc`;
