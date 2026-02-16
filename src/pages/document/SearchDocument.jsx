import React, { useEffect, useState } from 'react';
import { CrossCircle, Tag, Download, Eye, EyeSlash, Pdf } from '../../components/ui/Icon';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetSearchState,
} from '../../store/slices/documentSlice';
// import { Document, Page, pdfjs } from "react-pdf";
import { setPreviewDocument } from '../../store/slices/uiSlice';
import { checkFileType } from '../../features/document/fileTypeFeature';
import { searchDocuments, fetchPersonalNames, fetchDepartments } from "../../features/document/documentThunk"
import { documentTags } from "../../features/tag/tagThunk"
import { resetTagState } from '../../store/slices/tagSlice';

import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// import workerSrc from "pdfjs-dist/build/pdf.worker.min?url";

// pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

const SearchDocument = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth)
  const {
    personalNames,
    departments,
    srchLoading,
    srchSuccess,
    srchError,
    srchMessage,
    srchDocData
  } = useSelector((state) => state.document);
  const {
    tagSuccess,
    tagError,
    tagData
  } = useSelector((state) => state.tag)
  const { previewDocument } = useSelector((state) => state.ui)

  // Local state
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [currentPreview, setCurrentPreview] = useState(null);

  const [searchParams, setSearchParams] = useState({
    "major_head": "",
    "minor_head": "",
    "from_date": "",
    "to_date": "",
    "uploaded_by": user.user_id,
    "start": 0,
    "length": 10,
    "filterId": "",
    "search": {
      "value": ""
    }
  })
  const [searchResults, setSearchResults] = useState([])
  const [fileType, setFileType] = useState(null);
  const [numPages, setNumPages] = useState(null);
  // Load initial data
  useEffect(() => {
    const docTagData = {
      "term": ""
    }
    dispatch(documentTags(docTagData));
    dispatch(fetchPersonalNames());
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    if (tagSuccess) {
      setTags(tagData)
      dispatch(resetTagState())
    }

    if (srchSuccess) {
      setSearchResults(srchDocData.data)
    }
  }, [tagSuccess, tagError, srchSuccess, srchError])

  // Filter tag suggestions
  useEffect(() => {
    if (newTag) {
      const filtered = tags.filter(
        (tag) =>
          tag.label.toLowerCase().includes(newTag.toLowerCase()) &&
          !selectedTags.some(selected => selected.label === tag.label)
      );
      setTagSuggestions(filtered);
      setShowTagDropdown(filtered.length > 0);
    } else {
      setTagSuggestions([]);
      setShowTagDropdown(false);
    }
  }, [newTag, tags, selectedTags]);

  // Handle input changes
  const handleChange = ({ target: { name, value } }) => {
    setSearchParams((prev) => ({
      ...prev,
      [name]: value
    }));

    // Reset minorHead when major_head changes
    if (name === 'major_head') {
      setSearchParams((prev) => ({
        ...prev,
        minor_head: ''
      }));
    }
  };
  // Add tag
  const addTag = (tagName) => {
    if (!tagName.trim()) return; // empty tag ignore
    // check if tag already exists
    // const exists = tags.some(tag => tag.label === tagName.trim());
    const exists = selectedTags.some(tag => tag.tag_name === tagName.trim());
    if (exists) return;

    setSelectedTags([...selectedTags, { tag_name: tagName.trim() }]);
    setNewTag('');
    setShowTagDropdown(false);
  };

  // Remove tag
  const removeTag = (tagName) => {
    if (!tagName.tag_name.trim()) return;
    setSelectedTags(selectedTags.filter(tag => tag.tag_name !== tagName.tag_name.trim()));
  };
  // Handle search
  const handleSearch = () => {
    const data = { ...searchParams, tags: selectedTags }
    dispatch(searchDocuments(data));
  };
  // Handle clear filters
  const handleClearFilters = () => {
    setSelectedTags([]);
  };

  // Handle preview
  const handlePreview = (document) => {
    getFiletype(document.file_url)
    setCurrentPreview(document);
    setPreviewModalOpen(true);
  };

  // Handle download all as ZIP
  const handleDownloadAll = async () => {
    if (searchResults.length === 0) {
      toast.error('No documents to download');
      return;
    }

    const zip = new JSZip();
    const folder = zip.folder("documents");

    await Promise.all(
      searchResults.map(async (file) => {
        try {
          const response = await fetch(file.file_url);
          const blob = await response.blob();
          folder.file(file.fileName, blob);
        } catch (err) {
          console.error("Download failed:", file.url);
        }
      })
    );

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "documents.zip");

    searchResults.forEach((doc, index) => {
      const url = doc.file_url
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.click();
      }, index * 800);
    });
  };

  // Get second dropdown options
  const getMinorHeadOptions = () => {
    if (searchParams.major_head === 'Personal') {
      return personalNames;
    } else if (searchParams.major_head === 'Professional') {
      return departments;
    }
    return [];
  };

  // Check if file is previewable
  const isPreviewable = async (url) => {
    let status = false

    const type = await checkFileType(url);
    if (type === 'image') {
      status = true
    } else if (type === 'pdf') {
      status = true
    } else {
      status = false
    }
    return status;
  };

  // Check if file is previewable
  const getFiletype = async (url) => {
    const type = await checkFileType(url);
    setFileType(type)
  };

  const downloadFile = async (url) => {
    const fileName = await checkFileType(url);
    if (fileName === "image") {
      saveAs(url, "image.jpg");
    }
    else {
      saveAs(url, "document.pdf");
    }
  };
  return (
    <div className="fade-in">
      {/* Search Filters */}
      <div className="search-filters">
        <h5 className="mb-3">
          <i className="fas fa-filter me-2"></i>Search Filters
        </h5>

        <div className="row g-3">
          {/* Category Dropdown */}
          <div className="col-md-3">
            <label htmlFor="major_head" className="form-label">Category</label>
            <select
              className="form-select"
              id="major_head"
              name="major_head"
              value={searchParams.major_head}
              onChange={handleChange}
            >
              <option value="">All Categories</option>
              <option value="Personal">Personal</option>
              <option value="Professional">Professional</option>
            </select>
          </div>

          {/* Name/Department Dropdown */}
          <div className="col-md-3">
            <label htmlFor="minor_head" className="form-label">
              {searchParams.major_head === 'Personal' ? 'Name' :
                searchParams.major_head === 'Professional' ? 'Department' : 'Name/Dept'}
            </label>
            <select
              className="form-select"
              id="minor_head"
              name="minor_head"
              value={searchParams.minor_head}
              onChange={handleChange}
              disabled={!searchParams.major_head}
            >
              <option value="">All</option>
              {getMinorHeadOptions().map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* From Date */}
          <div className="col-md-3">
            <label htmlFor="from_date" className="form-label">From Date</label>
            <input
              type="date"
              className="form-control"
              id="from_date"
              name="from_date"
              value={searchParams.from_date}
              onChange={handleChange}
            />
          </div>

          {/* To Date */}
          <div className="col-md-3">
            <label htmlFor="to_date" className="form-label">To Date</label>
            <input
              type="date"
              className="form-control"
              id="to_date"
              name="to_date"
              value={searchParams.to_date}
              onChange={handleChange}
            />
          </div>

          {/* Tags */}
          <div className="col-12">
            <label className="form-label">Tags</label>
            <div className="tag-container mb-2">
              {selectedTags.length === 0 && (
                <span className="text-muted">No tags selected</span>
              )}
              {selectedTags.map((tag) => (
                <span key={tag.tag_name} className="tag">
                  {tag.tag_name}
                  <CrossCircle color="red" size="20" onClick={() => removeTag(tag)} />
                </span>
              ))}
            </div>
            <div className="position-relative">
              <input
                type="text"
                className="form-control"
                placeholder="Type to filter by tags..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onFocus={() => tagSuggestions.length > 0 && setShowTagDropdown(true)}
                onBlur={() => setTimeout(() => setShowTagDropdown(false), 200)}
              />
              {showTagDropdown && (
                <div className="position-absolute w-100 mt-1" style={{ zIndex: 1000 }}>
                  <div className="list-group shadow">
                    {tagSuggestions.map((tag) => (
                      <button
                        key={tag.label}
                        type="button"
                        className="list-group-item list-group-item-action"
                        onClick={() => addTag(tag.label)}
                      >
                        <Tag />
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="col-12">
            <div className="d-flex gap-2">
              <button
                className="btn btn-primary"
                onClick={handleSearch}
                disabled={srchLoading}
              >
                {srchLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Searching...
                  </>
                ) : (
                  <>
                    <i className="fas fa-search me-2"></i>
                    Search
                  </>
                )}
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={handleClearFilters}
                disabled={srchLoading}
              >
                <i className="fas fa-times me-2"></i>
                Clear Filters
              </button>
              {searchResults.length > 0 && (
                <button
                  className="btn btn-success ms-auto"
                  onClick={handleDownloadAll}
                >
                  <i className="fas fa-file-zipper me-2"></i>
                  Download All as ZIP
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="fas fa-list me-2"></i>Search Results
          </h5>
          <span className="badge bg-primary">{searchResults.length} documents found</span>
        </div>

        <div className="card-body">
          {srchLoading ? (
            <div className="spinner-container">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-folder-open fa-4x text-muted mb-3"></i>
              <h5 className="text-muted">No Documents Found</h5>
              <p className="text-muted mb-0">
                Try adjusting your search filters or search for all documents
              </p>
              <button
                className="btn btn-outline-primary mt-3"
                onClick={handleSearch}
              >
                <i className="fas fa-search me-2"></i>
                Show All Documents
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>File</th>
                    <th>Category</th>
                    <th>Name/Dept</th>
                    {/* <th>Tags</th> */}
                    <th>Date</th>
                    <th>Remarks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((doc) => (
                    <tr key={doc.document_id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="ms-2">
                            {/* <div className="fw-bold">{doc.fileName}</div> */}
                            <small className="text-muted">
                              FILE
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${doc.major_head === 'Personal' ? 'bg-success' : 'bg-info'
                          }`}>
                          {doc.major_head}
                        </span>
                      </td>
                      <td>{doc.minor_head}</td>
                      {/* <td>
                        <div className="d-flex flex-wrap gap-1">
                          {doc.tags?.map((tag) => (
                            <span key={tag.tag_name} className="tag" style={{ fontSize: '0.75rem' }}>
                              {tag.tag_name}
                            </span>
                          ))}
                        </div>
                      </td> */}
                      <td>{doc.document_date.slice(0, 10)}</td>
                      <td>
                        <small className="text-muted">
                          {doc.document_remarks?.substring(0, 50)}
                          {doc.document_remarks?.length > 50 && '...'}
                          {doc.document_remarks?.length == 0 && '-'}
                        </small>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          {isPreviewable(doc.file_url) ? (
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handlePreview(doc)}
                              title="Preview"
                            >
                              <Eye />
                            </button>
                          ) : (
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              disabled
                              title="Preview not available"
                            >
                              <EyeSlash />
                            </button>
                          )}
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => downloadFile(doc.file_url)}
                            title="Download"
                          >
                            <Download />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewModalOpen && currentPreview && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setPreviewModalOpen(false)}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-eye me-2"></i>
                  Document Preview
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setPreviewModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">

                {/* Preview Content */}
                <div className="bg-light p-4 rounded text-center">
                  {fileType === 'image' ? (
                    <div>
                      <i className="fas fa-image fa-5x text-muted mb-3"></i>
                      <p className="text-muted">
                        <img src={currentPreview.file_url} alt="image" width="200" />
                      </p>
                    </div>
                  ) : fileType === 'pdf' ? (
                    <div>
                      <i className="fas fa-file-pdf fa-5x text-danger mb-3"></i>
                      <div className="text-muted">


                        <a href={currentPreview.file_url} target='blank_'>
                          <p className="d-flex flex-column align-items-center gap-2">
                            <Pdf size='100' />
                            <span>View PDF</span>
                          </p>

                        </a>

                        {/* <Document
                          file={currentPreview.file_url}
                          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                          onLoadError={(err) => {
                            console.error("PDF LOAD ERROR => ", err);
                          }}
                        >
                          {Array.from(new Array(numPages), (_, i) => (
                            <Page key={i} pageNumber={i + 1} />
                          ))}
                        </Document> */}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <i className="fas fa-file fa-5x text-muted mb-3"></i>
                      <p className="text-muted">Preview not available for this file type</p>
                      {/* {getFiletype(currentPreview.file_url)} */}
                    </div>
                  )}
                </div>

                {/* Document Details */}
                <div className="mt-3">
                  <h6>Document Details:</h6>
                  <table className="table table-sm">
                    <tbody>
                      <tr>
                        <td><strong>Category:</strong></td>
                        <td>{currentPreview.major_head}</td>
                      </tr>
                      <tr>
                        <td><strong>Name/Department:</strong></td>
                        <td>{currentPreview.minor_head}</td>
                      </tr>
                      <tr>
                        <td><strong>Date:</strong></td>
                        <td>{currentPreview.document_date.slice(0, 10)}</td>
                      </tr>
                      <tr>
                        <td><strong>Uploaded By:</strong></td>
                        <td>{currentPreview.uploaded_by}</td>
                      </tr>
                      {currentPreview.remarks && (
                        <tr>
                          <td><strong>Remarks:</strong></td>
                          <td>{currentPreview.remarks}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setPreviewModalOpen(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    downloadFile(currentPreview.file_url);
                    setPreviewModalOpen(false);
                  }}
                >
                  <i className="fas fa-download me-2"></i>
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchDocument;

