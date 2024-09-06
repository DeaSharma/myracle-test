const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(express.json());

const sampleTestCase = `
Test Case ID: TC001
Title: Verify User Login Functionality
Description: This test case verifies that a user can successfully log in to the application using valid credentials.
Pre-conditions:
1. The application is accessible and the login page is displayed.
2. A valid user account exists in the system.
Test Steps:
1. Enter a valid username in the username field.
2. Enter a valid password in the password field.
3. Click on the "Login" button.
Expected Results:
1. The user should be successfully logged in.
2. The user should be redirected to the dashboard or home page.
3. A welcome message should be displayed with the user's name.
Actual Results: [To be filled during test execution]
Status: [Pass/Fail]
Notes: Ensure to test with different valid user accounts to verify consistency.
`;

app.post('/api/generate-test-instructions', upload.any(), async (req, res) => {
  try {
    const { context } = req.body;
    const images = req.files;

    console.log('Received context:', context);
    console.log('Received files:', images);

    if (!images || images.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

   
    const imagesParts = await Promise.all(images.map(async (img) => {
      const imageData = await fs.promises.readFile(img.path);
      return {
        inlineData: {
          data: imageData.toString('base64'),
          mimeType: img.mimetype
        }
      };
    }));

    // using gemini's free one...
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Analyze the following screenshot(s) and generate a detailed test case. Use the following sample test case as a reference for the format and level of detail required:

${sampleTestCase}

Now, based on the provided screenshots, create a similar test case that includes:
1. Test Case ID
2. Title
3. Description of what the test case is about
4. Pre-conditions needed before testing
5. Step-by-step testing instructions (be very specific and detailed)
6. Expected results for each step
7. Fields for Actual Results and Status
8. Notes or additional considerations

Remember to:
- Be as specific as possible, referencing exact text, buttons, or elements visible in the screenshots.
- If multiple screenshots are provided, create a test case that covers the flow across all screenshots.
- Include any relevant error scenarios or edge cases that should be tested based on the UI elements visible.
- Mention the specific location of elements on the page (e.g., header, footer, left sidebar).
- Include all relevant information visible in the screenshot, not just the most prominent elements.
- Consider responsive design aspects if the screenshot shows a mobile or tablet view.
- Include steps to verify the functionality of any interactive elements visible (e.g., buttons, forms, links).

Additional context provided by the user: ${context || 'No additional context provided'}

Please generate a comprehensive and detailed test case now.`;

    const result = await model.generateContent([prompt, ...imagesParts]);
    const response = await result.response;
    const generatedInstructions = response.text();

    
    images.forEach(img => fs.unlinkSync(img.path));

    res.json({ result: generatedInstructions });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request: ' + error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
