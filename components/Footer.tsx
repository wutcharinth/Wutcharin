import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 border-t border-gray-800/50 py-8 text-center">
            <div className="container mx-auto px-4">
                <p className="text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Wutcharin Thatan. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;