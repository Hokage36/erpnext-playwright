# ERPNext Playwright

Bo test nay da duoc cau hinh de chay CI/CD bang GitHub Actions voi moi truong dich:

- `https://erpnext.sangttx.xyz`

## Workflow da them

- CI tu dong khi `push` len `main`/`master`
- CI tu dong khi mo `pull_request` vao `main`/`master`
- Chay tay bang `workflow_dispatch`
- Deploy `playwright-report` len GitHub Pages sau khi merge vao `main` hoac `master`

## GitHub secrets can tao

- `ERP_USERNAME`
- `ERP_PASSWORD`

## Cach chay local

Bo test uu tien bien moi truong tren CI, va tu dong fallback sang file local tren may ca nhan:

- `playwright/.auth/local.credentials.json`

Noi dung file:

```json
{
  "username": "Administrator",
  "password": "admin"
}
```

Thu muc `playwright/.auth/` da duoc ignore, nen file nay se khong bi commit.

Neu muon, ban van co the ghi de bang bien moi truong trong terminal.

PowerShell:

```powershell
$env:BASE_URL = 'https://erpnext.sangttx.xyz'
$env:ERP_USERNAME = 'your-user'
$env:ERP_PASSWORD = 'your-password'
npm ci
npx playwright install chromium
npm run test:e2e
```

Neu da tao `playwright/.auth/local.credentials.json`, co the bo qua 2 dong `ERP_USERNAME` va `ERP_PASSWORD`:

```powershell
$env:BASE_URL = 'https://erpnext.sangttx.xyz'
npm ci
npx playwright install chromium
npx playwright test tests/selling/sales-order.spec.ts --project=chromium
```

## Xem trace khi fail

- Chay test binh thuong: `npm run test:e2e`
- Local da duoc cau hinh `trace: retain-on-failure`, nen test fail se giu lai `trace.zip` trong `test-results/`
- Mo HTML report: `npm run test:e2e:report`
- Tu HTML report, chon test fail va bam link `Trace` de mo Trace Viewer
- Neu muon mo truc tiep file trace: `npm run test:e2e:trace -- test-results/<test-folder>/trace.zip`

## GitHub repo setup

1. Push cac thay doi nay len repo `Hokage36/erpnext-playwright`.
2. Vao `Settings -> Secrets and variables -> Actions` va tao `ERP_USERNAME`, `ERP_PASSWORD`.
3. Vao `Settings -> Pages` va chon `GitHub Actions` lam publishing source.

## Ghi chu

- Dang nhap hien duoc tao dong trong `setup/auth.setup.ts`, khong con dung file session commit san.
- CI chi chay `chromium` de tranh tao du lieu lap lai tren moi truong ERPNext that.
- Bao cao HTML van duoc upload artifact cho moi lan chay, ke ca khi test fail.
- O local, trace se duoc giu lai khi test fail de debug bang Trace Viewer.
