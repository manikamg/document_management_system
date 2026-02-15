import React, { useEffect, useState, useRef } from 'react';
import { Form, Button } from 'react-bootstrap';
import { CrossCircle, Tag } from '../../components/ui/Icon';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { resetUploadState } from '../../store/slices/documentSlice';
import { uploadDocument, fetchPersonalNames, fetchDepartments } from "../../features/document/documentThunk"
import { documentTags } from "../../features/tag/tagThunk"
import { resetTagState } from '../../store/slices/tagSlice';

const FileUpload = () => {
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    const { user } = useSelector((state) => state.auth)
    const {
        personalNames,
        departments,
        uploading,
        error,
        success,
    } = useSelector((state) => state.document);
    const {
        tagSuccess,
        tagError,
        tagData
    } = useSelector((state) => state.tag)

    // Local state
    const [validated, setValidated] = useState(false);
    const [newTag, setNewTag] = useState('');
    const [tagSuggestions, setTagSuggestions] = useState([]);
    const [showTagDropdown, setShowTagDropdown] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [filePreview, setFilePreview] = useState(null);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [file, setFile] = useState(null)
    const [selectedDate, setSelectedDate] = useState(null);
    const [uploadForm, setUploadForm] = useState(
        {
            major_head: "",
            minor_head: "",
            document_date: "",
            document_remarks: "",
            user_id: user.user_id
        }
    )
    // Load initial data
    useEffect(() => {
        const docTagData = {
            "term": ""
        }
        dispatch(documentTags(docTagData));
        dispatch(fetchPersonalNames());
        dispatch(fetchDepartments());
        dispatch(resetUploadState());
    }, [dispatch]);

    useEffect(() => {
        if (tagSuccess) {
            setTags(tagData)
        }
    }, [tagSuccess, tagError])
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

    // Clear messages on unmount
    // useEffect(() => {
    //     return () => {

    //     };
    // }, [dispatch]);

    // Handle form field changes
    const handleChange = ({ target: { name, value } }) => {
        setUploadForm((prev) => ({
            ...prev,
            [name]: value
        }));

        // Reset minorHead when majorHead changes
        if (name === 'major_head') {
            setUploadForm((prev) => ({
                ...prev,
                minor_head: ''
            }));
        }
    };

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            validateAndSetFile(file);
        }
    };

    // Validate and set file
    const validateAndSetFile = (file) => {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.gif'];

        const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

        if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
            toast.error('Only Image and PDF files are allowed!');
            return;
        }

        // Create preview for images
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFilePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFilePreview(null);
        }
    };

    // Handle drag and drop
    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            validateAndSetFile(file);
        }
    };

    // Handle tag selection

    // Add tag
    const addTag = (tagName) => {
        if (!tagName.trim()) return; // empty tag ignore
        // check if tag already exists
        // const exists = tags.some(tag => tag.label === tagName.trim());
        const exists = selectedTags.some(tag => tag.tag_name === tagName.trim());
        if (exists) return;

        setSelectedTags([...selectedTags, { tag_name: tagName.trim() }]);
        setNewTag('');
    };

    // Remove tag
    const removeTag = (tagName) => {
        if (!tagName.tag_name.trim()) return;
        setSelectedTags(selectedTags.filter(tag => tag.tag_name !== tagName.tag_name.trim()));
    };

    // Handle new tag input
    const handleNewTagKeyDown = (e) => {
        if (e.key === 'Enter' && newTag.trim()) {
            e.preventDefault();
            addTag(newTag.trim());
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('documentDate', uploadForm.document_date);
        formData.append('majorHead', uploadForm.major_head);
        formData.append('minorHead', uploadForm.minor_head);
        formData.append('tags', JSON.stringify(selectedTags));
        formData.append('remarks', uploadForm.document_remarks || '');
        formData.append('file', file);

        dispatch(uploadDocument(formData));
    };

    // Handle success - reset form
    // useEffect(() => {
    //     if (success) {
    //         setTimeout(() => {
    //             dispatch(resetUploadState());
    //             setFilePreview(null);
    //             if (fileInputRef.current) {
    //                 fileInputRef.current.value = '';
    //             }
    //         }, 2000);
    //     }
    // }, [success, dispatch]);

    // Get second dropdown options based on majorHead
    const getMinorHeadOptions = () => {
        if (uploadForm.major_head === 'Personal') {
            return personalNames;
        } else if (uploadForm.major_head === 'Professional') {
            return departments;
        }
        return [];
    };

    return (
        <div className="fade-in">
            <div className="row">
                <div className="col-lg-8 mx-auto">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="mb-0">
                                <i className="fas fa-cloud-upload-alt me-2"></i>
                                Upload Document
                            </h4>
                        </div>

                        <div className="card-body">
                            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                {/* Date Picker */}
                                <Form.Group className="mb-4" controlId="documentDate">
                                    <Form.Label>
                                        <i className="fas fa-calendar me-2"></i>Document Date
                                    </Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="document_date"
                                        value={uploadForm.document_date}
                                        onChange={handleChange}
                                        max={new Date().toISOString().split('T')[0]}
                                        required
                                    />

                                    <Form.Control.Feedback type="invalid">
                                        Document Date is required
                                    </Form.Control.Feedback>
                                </Form.Group>

                                {/* Category Dropdown */}
                                <Form.Group className="mb-4" controlId="majorHead">
                                    <Form.Label>
                                        <i className="fas fa-folder me-2"></i>Category (Major Head)
                                    </Form.Label>
                                    <Form.Select
                                        name="major_head"
                                        value={uploadForm.major_head}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Personal">Personal</option>
                                        <option value="Professional">Professional</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        Category is required
                                    </Form.Control.Feedback>
                                </Form.Group>

                                {/* Dynamic Second Dropdown */}
                                <Form.Group className="mb-4" controlId="minorHead">
                                    <Form.Label>
                                        <i className="fas fa-list me-2"></i>
                                        {uploadForm.major_head === 'Personal'
                                            ? 'Name'
                                            : uploadForm.major_head === 'Professional'
                                                ? 'Department'
                                                : 'Select Option'}{' '}
                                        (Minor Head)
                                    </Form.Label>
                                    <Form.Select
                                        name="minor_head"
                                        value={uploadForm.minor_head}
                                        onChange={handleChange}
                                        disabled={!uploadForm.major_head}
                                        required
                                    >
                                        <option value="">
                                            {uploadForm.major_head ? 'Select' : 'Select Category First'}
                                        </option>
                                        {getMinorHeadOptions().map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        Minor Head is required
                                    </Form.Control.Feedback>
                                </Form.Group>

                                {/* Tags Input */}
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        <i className="fas fa-tags me-2"></i>Tags
                                    </Form.Label>

                                    {/* Selected Tags */}
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

                                    {/* Tag Input with Autocomplete */}
                                    <div className="position-relative">
                                        <Form.Control
                                            type="text"
                                            placeholder="Type to add tags..."
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            onKeyDown={handleNewTagKeyDown}
                                            onFocus={() => tagSuggestions.length > 0 && setShowTagDropdown(true)}
                                            onBlur={() => setTimeout(() => setShowTagDropdown(false), 200)}
                                        />

                                        {/* Tag Suggestions Dropdown */}
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

                                    <Form.Text>Select existing tags or press Enter to add a new tag</Form.Text>
                                </Form.Group>

                                {/* Remarks */}
                                <Form.Group className="mb-4" controlId="remarks">
                                    <Form.Label>
                                        <i className="fas fa-comment me-2"></i>Remarks
                                    </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="remarks"
                                        placeholder="Add any remarks about this document..."
                                        value={uploadForm.remarks}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                {/* File Upload */}
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        <i className="fas fa-file me-2"></i>File (Image or PDF only)
                                    </Form.Label>

                                    <div
                                        className={`file-upload-area ${dragOver ? 'dragover' : ''}`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Form.Control
                                            type="file"
                                            ref={fileInputRef}
                                            className="d-none"
                                            accept=".pdf,.jpg,.jpeg,.png,.gif"
                                            onChange={handleFileChange}
                                        />

                                        {uploadForm.file ? (
                                            <div>
                                                <i className="fas fa-file-pdf fa-3x text-primary mb-3"></i>
                                                <p className="mb-1 fw-bold">{uploadForm.fileName}</p>
                                                <p className="text-muted mb-0">
                                                    {(uploadForm.file.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                        ) : (
                                            <div>
                                                <i className="fas fa-cloud-upload-alt fa-3x text-secondary mb-3"></i>
                                                <p className="mb-1">
                                                    <strong>Click to browse</strong> or drag and drop
                                                </p>
                                                <p className="text-muted mb-0">PDF, JPG, JPEG, PNG, GIF (Max 10MB)</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* File Preview */}
                                    {filePreview && (
                                        <div className="mt-3 text-center">
                                            <img
                                                src={filePreview}
                                                alt="Preview"
                                                className="file-preview"
                                                style={{ maxHeight: '200px' }}
                                            />
                                        </div>
                                    )}
                                </Form.Group>

                                {/* Submit & Reset Buttons */}
                                <div className="d-grid gap-2">
                                    <Button type="submit" size="lg" disabled={uploading}>
                                        {uploading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-upload me-2"></i>Upload Document
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Form>

                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={3000}
            />
        </div>
    );
};

export default FileUpload;

