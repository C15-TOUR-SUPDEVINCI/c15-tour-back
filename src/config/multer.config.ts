// import { diskStorage } from 'multer';
// import { extname } from 'path';
// import { BadRequestException } from '@nestjs/common';
// import { existsSync, mkdirSync } from 'fs';

// // Get upload directory from environment or use default
// const uploadDir = process.env.UPLOAD_DIR || '/tmp/uploads';

// // Ensure upload directory exists
// if (!existsSync(uploadDir)) {
//   mkdirSync(uploadDir, { recursive: true });
// }

// // Get max file size from environment (in MB) or use default 100MB
// const maxFileSizeMB = parseInt(process.env.MAX_UPLOAD_SIZE_MB || '100', 10);
// const maxFileSize = maxFileSizeMB * 1024 * 1024; // Convert to bytes

// export const multerConfig = {
//   storage: diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//       // Generate unique filename: timestamp-random-originalname
//       const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//       const ext = extname(file.originalname);
//       const nameWithoutExt = file.originalname.replace(ext, '');
//       cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
//     },
//   }),
//   limits: {
//     fileSize: maxFileSize,
//   },
//   fileFilter: (req: any, file: any, cb: any) => {
//     // Validate file extension
//     const allowedExtensions = ['.csv', '.xlsx', '.xls'];
//     const ext = extname(file.originalname).toLowerCase();

//     if (!allowedExtensions.includes(ext)) {
//       return cb(
//         new BadRequestException(
//           `Invalid file type. Only CSV and Excel files are allowed. Received: ${ext}`,
//         ),
//         false,
//       );
//     }

//     // Validate mimetype
//     const allowedMimetypes = [
//       'text/csv',
//       'application/vnd.ms-excel',
//       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//       'application/csv',
//       'text/plain', // Some systems send CSV as text/plain
//     ];

//     if (!allowedMimetypes.includes(file.mimetype)) {
//       return cb(
//         new BadRequestException(
//           `Invalid file mimetype. Expected CSV or Excel. Received: ${file.mimetype}`,
//         ),
//         false,
//       );
//     }

//     cb(null, true);
//   },
// };
