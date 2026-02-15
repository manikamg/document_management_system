import React, { useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchDocument } from '../../features/document/documentThunk';
import Card from '../../components/ui/Card';
import { Users, File } from '../../components/ui/Icon';

const Dashboard = () => {
    const dispatch = useDispatch()
    const totalUser = JSON.parse(localStorage.getItem("dummyUsers"))?.length || 0
    const { user } = useSelector((state) => state.auth);
    const { srchDocData } = useSelector((state) => state.document);

    const getDocument = useCallback(() => {
        const data = {
            "major_head": "",
            "minor_head": "",
            "from_date": "",
            "to_date": "",
            "tags": [{ "tag_name": "" }],
            "uploaded_by": "",
            "start": 0,
            "length": 10,
            "filterId": "",
            "search": {
                "value": ""
            }
        }
        dispatch(searchDocument(data))
    }, [dispatch])
   
    useEffect(() => {
        getDocument();
    }, []);

    return (
        <div className="fade-in">
            {/* Welcome Section */}
            <div className="card mb-4">
                <div className="card-body">
                    <h2 className="mb-2">
                        <i className="fas fa-hand-wave me-2 text-primary"></i>
                        Welcome, {user?.user_name || 'User'}!
                    </h2>
                    <p className="text-muted mb-0">
                        Manage your documents efficiently with our Document Management System.
                        Upload, search, and organize your files with ease.
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="row mb-4">
                <div className="col-12">
                    <h4 className="mb-3">
                        <i className="fas fa-bolt me-2"></i>Quick Actions
                    </h4>
                </div>

                <div className="col-md-6 mb-3">
                    <Link to="/upload-document" className="text-decoration-none">
                        <div className="card h-100 border-primary">
                            <div className="card-body d-flex align-items-center">
                                <div className="me-3">
                                    <i className="fas fa-upload fa-2x text-primary"></i>
                                </div>
                                <div>
                                    <h5 className="mb-1 text-dark">Upload Document</h5>
                                    <p className="mb-0 text-muted small">Upload new documents with tags and metadata</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="col-md-6 mb-3">
                    <Link to="/search-document" className="text-decoration-none">
                        <div className="card h-100 border-info">
                            <div className="card-body d-flex align-items-center">
                                <div className="me-3">
                                    <i className="fas fa-search fa-2x text-info"></i>
                                </div>
                                <div>
                                    <h5 className="mb-1 text-dark">Search Documents</h5>
                                    <p className="mb-0 text-muted small">Find documents by category, tags, or date</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row mb-4">
                <div className="col-12">
                    <h4 className="mb-3">
                        <i className="fas fa-chart-bar me-2"></i>Overview
                    </h4>
                </div>

                <Card title={"Total Documents"} value={srchDocData?.recordsTotal} color={"primary"} icon={<File color={"#000000"} size={"20"} />} link={"/upload-document"}  />
                <Card title={"Total User"} value={totalUser} color={"primary"} icon={<Users color={"#000000"} size={"20"} />} link={"/users"}  />
           
            </div>
        </div>
    );
};

export default Dashboard;

