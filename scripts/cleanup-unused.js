import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// List of core unused business files (dead weight, old templates, unused pages)
const CORE_UNUSED_FILES = [
  'dev.js',
  'src/App.css',
  'src/components/3DViewer.tsx',
  'src/components/demo-case-manager.tsx',
  'src/components/demo-case-selector.tsx',
  'src/components/facial-analysis.tsx',
  'src/components/local-image-uploader.tsx',
  'src/components/patient-info.tsx',
  'src/components/PredictionResults.tsx',
  'src/components/processing-animation.tsx',
  'src/components/upload-cards.tsx',
  'src/components/validation-error-modal.tsx',
  'src/components/xray-analysis.tsx',
  'src/hooks/use-mobile.tsx',
  'src/pages/home.tsx',
  'src/pages/xray-analysis.tsx',
  'src/styles/buttonStyles.ts',
  'src/types/index.ts'
];

// List of unused generic shadcn/UI components (you might want to keep or delete them)
const UI_UNUSED_FILES = [
  'src/components/ui/accordion.tsx',
  'src/components/ui/AdvancedLighting.tsx',
  'src/components/ui/alert-dialog.tsx',
  'src/components/ui/aspect-ratio.tsx',
  'src/components/ui/breadcrumb.tsx',
  'src/components/ui/calendar.tsx',
  'src/components/ui/carousel.tsx',
  'src/components/ui/chart.tsx',
  'src/components/ui/checkbox.tsx',
  'src/components/ui/collapsible.tsx',
  'src/components/ui/command.tsx',
  'src/components/ui/context-menu.tsx',
  'src/components/ui/CrossSection.tsx',
  'src/components/ui/dialog.tsx',
  'src/components/ui/drawer.tsx',
  'src/components/ui/dropdown-menu.tsx',
  'src/components/ui/ErrorBoundary.tsx',
  'src/components/ui/form.tsx',
  'src/components/ui/hover-card.tsx',
  'src/components/ui/input-otp.tsx',
  'src/components/ui/label.tsx',
  'src/components/ui/LoadingOverlay.tsx',
  'src/components/ui/menubar.tsx',
  'src/components/ui/navigation-menu.tsx',
  'src/components/ui/pagination.tsx',
  'src/components/ui/popover.tsx',
  'src/components/ui/radio-group.tsx',
  'src/components/ui/resizable.tsx',
  'src/components/ui/select.tsx',
  'src/components/ui/separator.tsx',
  'src/components/ui/sheet.tsx',
  'src/components/ui/sidebar.tsx',
  'src/components/ui/SingleObjViewer.tsx',
  'src/components/ui/SingleStlViewer.tsx',
  'src/components/ui/skeleton.tsx',
  'src/components/ui/slider.tsx',
  'src/components/ui/switch.tsx',
  'src/components/ui/table.tsx',
  'src/components/ui/textarea.tsx',
  'src/components/ui/toggle-group.tsx',
  'src/components/ui/toggle.tsx',
  'src/components/ui/ToothAxisArrows.tsx',
  'src/components/ui/ToothNumberLabels.tsx',
  'src/components/ui/ToothSegmentBoxes.tsx'
];

const isDryRun = process.argv.includes('--dry-run');
const cleanUI = process.argv.includes('--all') || process.argv.includes('--ui');

console.log('==================================================');
console.log('       DENTAL AI CODEBASE CLEANUP SCRIPT         ');
console.log('==================================================');
if (isDryRun) {
  console.log('👉 MODE: DRY RUN (No files will be deleted)\n');
} else {
  console.log('⚠️  MODE: ACTUAL CLEANUP (Files will be permanently deleted)\n');
}

let filesToDelete = [...CORE_UNUSED_FILES];
if (cleanUI) {
  console.log('📦 Also cleaning unused Shadcn/UI library files (--ui/--all flags detected).');
  filesToDelete = [...filesToDelete, ...UI_UNUSED_FILES];
} else {
  console.log('💡 Note: Standard Shadcn/UI components are preserved by default.');
  console.log('   Run with `--ui` or `--all` if you also want to remove unused Shadcn components.');
}

console.log(`\nFound ${filesToDelete.length} files targeted for removal:\n`);

let deletedCount = 0;
let skippedCount = 0;
let errorCount = 0;

filesToDelete.forEach(relativePath => {
  const absolutePath = path.resolve(ROOT_DIR, relativePath);
  
  if (!fs.existsSync(absolutePath)) {
    console.log(`⚪ [NOT FOUND] ${relativePath}`);
    skippedCount++;
    return;
  }

  if (isDryRun) {
    console.log(`🟡 [WOULD DELETE] ${relativePath}`);
    deletedCount++;
  } else {
    try {
      fs.unlinkSync(absolutePath);
      console.log(`🔴 [DELETED]      ${relativePath}`);
      deletedCount++;
    } catch (err) {
      console.error(`❌ [ERROR]        Failed to delete ${relativePath}: ${err.message}`);
      errorCount++;
    }
  }
});

console.log('\n==================================================');
console.log('                 CLEANUP SUMMARY                  ');
console.log('==================================================');
console.log(`Files Processed: ${deletedCount + skippedCount + errorCount}`);
console.log(`Files Deleted/Targeted: ${deletedCount}`);
console.log(`Files Not Found (Skipped): ${skippedCount}`);
console.log(`Errors encountered: ${errorCount}`);
console.log('==================================================');

if (isDryRun) {
  console.log('\n💡 To perform the actual deletion, run:');
  console.log('   node scripts/cleanup-unused.js\n');
  console.log('💡 To also delete unused generic UI components, run:');
  console.log('   node scripts/cleanup-unused.js --ui\n');
} else {
  console.log('\n✅ Cleanup complete! Please verify your project builds successfully using `npm run build`.');
}
