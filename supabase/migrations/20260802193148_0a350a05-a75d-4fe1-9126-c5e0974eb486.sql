-- 1. Typos: Apple Developer Account lesson
UPDATE lessons SET content_html = replace(
  replace(content_html,
    'The first step to publish your app on App Store enroll in the',
    'The first step to publish your app on the App Store is to enroll in the'),
  'At</a> click on', 'Click on')
WHERE id = 'f73d27b6-b506-4229-b92a-833919016e02';

UPDATE lessons SET content_html = replace(content_html, '>At<', '>the enrollment page<')
WHERE id = 'f73d27b6-b506-4229-b92a-833919016e02';

-- 2. Typo: Step 5
UPDATE lessons SET content_html = replace(content_html, 'you will see na error', 'you will see an error')
WHERE id = '49f90199-624b-4a95-8c2a-de8561b88791';

-- 3. Step 7: drop duplicated build-selection + submit sections and empty code blocks
UPDATE lessons SET content_html = regexp_replace(
  replace(
    regexp_replace(content_html, '<h3>5\. Choose your uploaded build</h3>.*?<h3>Submit for review</h3>', '<h3>Submit for review</h3>', 'g'),
    '<pre><code></code></pre>', ''),
  '<h3>Submit for review</h3>.*?(?=<p>TestFlight is not mandatory)', '', 'g')
WHERE id = 'c4b325c2-90c6-4864-b22f-4b1a93b96bf9';

-- 4. Step 10: strip pasted Tailwind CSS variable soup from inline styles
UPDATE lessons SET content_html = regexp_replace(content_html, '\s*style="[^"]*--tw-[^"]*"', '', 'g')
WHERE content_html LIKE '%--tw-%';

-- 5. Tidy title
UPDATE lessons SET title = 'App Store Screenshots' WHERE id = '8a1ee84b-6472-4704-8644-1ea19226d1b5';

-- 6. Reorder: asset lessons (icons/screenshots) before Step 7
UPDATE lessons SET order_index = 62 WHERE id = 'e9a8956a-0a96-4775-8a9b-a5b8e133aeb4';
UPDATE lessons SET order_index = 64 WHERE id = 'bc240f31-d854-405d-b98e-e7df67d32cf1';
UPDATE lessons SET order_index = 66 WHERE id = '8a1ee84b-6472-4704-8644-1ea19226d1b5';
UPDATE lessons SET order_index = 68 WHERE id = '87c4aaa6-36a3-45ac-9d5f-f7fec90fffed';
UPDATE lessons SET order_index = 105 WHERE id = 'cee9fb94-516b-4a8b-9c6a-8dbb9b2789b6';