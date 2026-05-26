# ERPNext Playwright

Bộ test này đã được cấu hình để chạy CI/CD bằng
GitHub Actions với môi trường đích:

- `https://erpnext.sangttx36.online`

## Workflow da them

- CI tự động khi `push` lên `main`
- CI tự động khi mở `pull_request` vào `main`
- Chạy tay bằng `workflow_dispatch`
- Deploy `playwright-report` lên GitHub Pages sau khi merge vào `main` 

## GitHub secrets can tao

- `ERP_USERNAME`
- `ERP_PASSWORD`

## Cach chay local

Bộ test ưu tiên biến môi trường trên CI, và tự động fallback sang file local trên máy tính cá nhân:

- `.auth/local.credentials.json`

PowerShell:

```powershell
$env:BASE_URL = 'https://erpnext.sangttx36.online'
$env:ERP_USERNAME = 'your-user'
$env:ERP_PASSWORD = 'your-password'
npm ci
npx playwright install chromium
npm run test:e2e
```

Nếu đã tạo `.auth/local.credentials.json`, có thể bỏ qua 2 dòng `ERP_USERNAME` va `ERP_PASSWORD`:

```powershell
$env:BASE_URL = 'https://erpnext.sangttx36.online'
npm ci
npx playwright install chromium
npx playwright test --project=chromium
```

## Xem trace khi fail

- Chạy test bình thường: `npm run test:e2e`
- Local đã được cấu hình `trace: retain-on-failure`, nên test fail sẽ giữ lại `trace.zip` trong `test-results/`
- Mở HTML report: `npm run test:e2e:report`
- Từ HTML report, chọn test fail và bấm vào link `Trace` để mở Trace Viewer
- Nếu muốn mở trực tiếp file trace: `npm run test:e2e:trace -- test-results/<test-folder>/trace.zip`

## GitHub repo setup

1. Push các thay đổi này lên `Hokage36/erpnext-playwright`.
2. Vào `Settings -> Secrets and variables -> Actions` va tạo `ERP_USERNAME`, `ERP_PASSWORD`.
3. Vào `Settings -> Pages` và chọn `GitHub Actions` làm publishing source.

