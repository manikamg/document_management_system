import React, { useEffect, useState } from 'react';
import { CrossCircle, Tag } from '../../components/ui/Icon';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearSearchParams,
  clearSearchResults,
  resetUploadState,
} from '../../store/slices/documentSlice';
import { setPreviewDocument } from '../../store/slices/uiSlice';

import { searchDocuments, fetchPersonalNames, fetchDepartments } from "../../features/document/documentThunk"
import { documentTags } from "../../features/tag/tagThunk"
import { resetTagState } from '../../store/slices/tagSlice';

import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const SearchDocument = () => {
  const dispatch = useDispatch();

  const {
    personalNames,
    departments,
    searchResults,
    searching,
    error,
  } = useSelector((state) => state.document);

  const {
    tagSuccess,
    tagError,
    tagData
  } = useSelector((state) => state.tag)

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
    "tags": [{ "tag_name": "" }, { "tag_name": "" }],
    "uploaded_by": "",
    "start": 0,
    "length": 5,
    "filterId": "",
    "search": {
      "value": ""
    }
  })
  console.log(searchParams)

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
  }, [tagSuccess, tagError])

  // Clear messages on unmount
  useEffect(() => {
    return () => {
      dispatch(resetUploadState());
      dispatch(clearSearchResults());
    };
  }, [dispatch]);

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
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setSearchParams({ [name]: value }));

    // Reset minorHead when major_head changes
    if (name === 'major_head') {
      dispatch(setSearchParams({ major_head: '' }));
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

  // Handle tag selection
  const handleSelectTag = (tag) => {
    if (!selectedTags.includes(tag)) {
      const newTags = [...selectedTags, tag];
      setSelectedTags(newTags);
      dispatch(setSearchParams({ tags: newTags }));
    }
    setNewTag('');
    setShowTagDropdown(false);
  };

  // Remove selected tag
  const handleRemoveTag = (tag) => {
    const newTags = selectedTags.filter((t) => t !== tag);
    setSelectedTags(newTags);
    dispatch(setSearchParams({ tags: newTags }));
  };

  // Handle search
  const handleSearch = () => {
    dispatch(searchDocuments({
      ...searchParams,
      tags: selectedTags,
    }));
  };

  // Handle clear filters
  const handleClearFilters = () => {
    dispatch(clearSearchParams());
    setSelectedTags([]);
    dispatch(clearSearchResults());
  };

  // Handle preview
  const handlePreview = (document) => {
    setCurrentPreview(document);
    setPreviewModalOpen(true);
    dispatch(setPreviewDocument(document));
  };

  // Handle download single file
  const handleDownload = (document) => {
    // In a real app, this would download from the server
    // For demo, we'll create a mock file
    const blob = new Blob([`Document: ${document.fileName}\nType: ${document.fileType}\nDate: ${document.documentDate}`], {
      type: 'text/plain;charset=utf-8',
    });
    saveAs(blob, document.fileName);
  };

  // Handle download all as ZIP
  const handleDownloadAll = async () => {
    if (searchResults.length === 0) {
      alert('No documents to download');
      return;
    }

    const zip = new JSZip();
    const folder = zip.folder('documents');

    searchResults.forEach((doc) => {
      // Add mock content for each document
      folder.file(
        doc.fileName,
        `Document: ${doc.fileName}\nType: ${doc.fileType}\nCategory: ${doc.major_head}\n${doc.remarks || ''}`
      );
    });

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `documents_${new Date().toISOString().split('T')[0]}.zip`);
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

  // Get file icon based on type
  const getFileIcon = (fileType) => {
    if (fileType?.includes('pdf')) {
      return <i className="fas fa-file-pdf fa-2x text-danger"></i>;
    } else if (fileType?.includes('image')) {
      return <i className="fas fa-file-image fa-2x text-success"></i>;
    } else {
      return <i className="fas fa-file fa-2x text-secondary"></i>;
    }
  };

  // Check if file is previewable
  const isPreviewable = (fileType) => {
    return fileType?.includes('pdf') || fileType?.includes('image');
  };

  return (
    <div className="fade-in">
      {/* Search Filters */}
      <div className="search-filters">
        <h5 className="mb-3">
          <i className="fas fa-filter me-2"></i>Search Filters
        </h5>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => dispatch(resetUploadState())}
            ></button>
          </div>
        )}

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
            <label htmlFor="minorHead" className="form-label">
              {searchParams.major_head === 'Personal' ? 'Name' :
                searchParams.major_head === 'Professional' ? 'Department' : 'Name/Dept'}
            </label>
            <select
              className="form-select"
              id="minorHead"
              name="minorHead"
              value={searchParams.minorHead}
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
            <label htmlFor="fromDate" className="form-label">From Date</label>
            <input
              type="date"
              className="form-control"
              id="fromDate"
              name="fromDate"
              value={searchParams.fromDate}
              onChange={handleChange}
            />
          </div>

          {/* To Date */}
          <div className="col-md-3">
            <label htmlFor="toDate" className="form-label">To Date</label>
            <input
              type="date"
              className="form-control"
              id="toDate"
              name="toDate"
              value={searchParams.toDate}
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
                disabled={searching}
              >
                {searching ? (
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
                disabled={searching}
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
          {searching ? (
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
                    <th>Tags</th>
                    <th>Date</th>
                    <th>Remarks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((doc) => (
                    <tr key={doc.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          {getFileIcon(doc.fileType)}
                          <div className="ms-2">
                            <div className="fw-bold">{doc.fileName}</div>
                            <small className="text-muted">
                              {doc.fileType?.split('/')[1]?.toUpperCase() || 'FILE'}
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
                      <td>{doc.minorHead}</td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          {doc.tags?.map((tag) => (
                            <span key={tag} className="tag" style={{ fontSize: '0.75rem' }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>{doc.documentDate}</td>
                      <td>
                        <small className="text-muted">
                          {doc.remarks?.substring(0, 50)}
                          {doc.remarks?.length > 50 && '...'}
                        </small>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          {isPreviewable(doc.fileType) ? (
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handlePreview(doc)}
                              title="Preview"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                          ) : (
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              disabled
                              title="Preview not available"
                            >
                              <i className="fas fa-eye-slash"></i>
                            </button>
                          )}
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleDownload(doc)}
                            title="Download"
                          >
                            <i className="fas fa-download"></i>
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
                <div className="text-center mb-3">
                  {getFileIcon(currentPreview.fileType)}
                  <h6 className="mt-2">{currentPreview.fileName}</h6>
                </div>

                {/* Preview Content */}
                <div className="bg-light p-4 rounded text-center">
                  {currentPreview.fileType?.includes('image') ? (
                    <div>
                      <i className="fas fa-image fa-5x text-muted mb-3"></i>
                      <p className="text-muted">
                        Image preview would be displayed here in production
                      </p>
                      <p className="small text-muted">
                        File: {currentPreview.fileName}
                      </p>
                    </div>
                  ) : currentPreview.fileType?.includes('pdf') ? (
                    <div>
                      <i className="fas fa-file-pdf fa-5x text-danger mb-3"></i>
                      <p className="text-muted">
                        PDF preview would be displayed here in production
                      </p>
                      <p className="small text-muted">
                        File: {currentPreview.fileName}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <i className="fas fa-file fa-5x text-muted mb-3"></i>
                      <p className="text-muted">Preview not available for this file type</p>
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
                        <td>{currentPreview.minorHead}</td>
                      </tr>
                      <tr>
                        <td><strong>Date:</strong></td>
                        <td>{currentPreview.documentDate}</td>
                      </tr>
                      <tr>
                        <td><strong>Uploaded By:</strong></td>
                        <td>{currentPreview.uploadedBy}</td>
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
                    handleDownload(currentPreview);
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

