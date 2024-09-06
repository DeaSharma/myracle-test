import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Textarea } from './textarea';
import { Button } from './button';


const ScreenshotTester = () => {
  const [context, setContext] = useState('');
  const [images, setImages] = useState([]);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContextChange = (e) => {
    setContext(e.target.value);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('context', context);
    images.forEach((image, index) => {
      formData.append(`image`, image);
    });
  
    try {
      const response = await fetch('/api/generate-test-instructions', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error('Error:', error);
      setResult('An error occurred while processing your request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Myracle Screenshot Tester</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label htmlFor="context" className="block mb-2">Optional Context:</label>
            <Textarea
              id="context"
              value={context}
              onChange={handleContextChange}
              placeholder="Enter any additional context here..."
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="images" className="block mb-2">Upload Screenshots:</label>
            <input
              type="file"
              id="images"
              onChange={handleImageUpload}
              multiple
              accept="image/*"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"
            />
          </div>
          <Button onClick={handleSubmit} disabled={loading || images.length === 0}>
            {loading ? 'Processing...' : 'Describe Testing Instructions'}
          </Button>
          {result && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Test Instructions:</h3>
              <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">{result}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScreenshotTester;