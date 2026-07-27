import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle, FiHome } from 'react-icons/fi';
import PageWrapper from '../components/common/PageWrapper';
import Container from '../components/common/Container';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <PageWrapper title="404 - Page Not Found">
      <Container className="flex-1 flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-6">
          <FiAlertTriangle className="w-10 h-10" />
        </div>
        <h1 className="text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
          404
        </h1>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">
          Page Not Found
        </h2>
        <p className="text-xs text-slate-500 max-w-md mb-8">
          The page or route you requested does not exist or has been relocated within the Basketly ecosystem.
        </p>
        <Link to="/">
          <Button variant="primary" size="lg" icon={FiHome}>
            Back to Home
          </Button>
        </Link>
      </Container>
    </PageWrapper>
  );
};

export default NotFound;
