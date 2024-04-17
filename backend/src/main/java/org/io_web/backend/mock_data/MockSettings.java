package org.io_web.backend.mock_data;

import org.io_web.backend.services.Settings;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;

public class MockSettings {
        static Settings settings = new Settings(5, 4, 4, 10, 30, new MultipartFile() {

        @Override
        public String getName() {
            return null;
        }

        @Override
        public String getOriginalFilename() {
            return null;
        }

        @Override
        public String getContentType() {
            return null;
        }

        @Override
        public boolean isEmpty() {
            return false;
        }

        @Override
        public long getSize() {
            return 0;
        }

        @Override
        public byte[] getBytes() throws IOException {
            return new byte[0];
        }

        @Override
        public InputStream getInputStream() throws IOException {
            String text;
            text = """
                          [
                          {
                            "question": "What is the capital of France?",
                            "answers": ["Paris", "London", "Berlin", "Rome"],
                            "correctAnswer": "Paris"
                          },
                          {
                            "question": "Who wrote 'Romeo and Juliet'?",
                            "answers": ["William Shakespeare", "Charles Dickens", "Jane Austen", "Leo Tolstoy"],
                            "correctAnswer": "William Shakespeare"
                          },
                          {
                            "question": "What is the chemical symbol for water?",
                            "answers": ["H2O", "CO2", "NaCl", "O2"],
                            "correctAnswer": "H2O"
                          }
                        ]""";
            byte[] byteArray = text.getBytes();
            return new ByteArrayInputStream(byteArray);
        }

        @Override
        public void transferTo(File dest) throws IOException, IllegalStateException {

        }
    });

        public static Settings getMockSettings(){
            return settings;
        }
}
