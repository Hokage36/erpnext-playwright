import { buildUniqueItem, masterData } from '../../../framework/data/master-data';
import { test } from '../../../framework/fixtures/app.fixture';
import { expectUnsavedNewDocument, stockNewDocumentUrlPatterns } from '../../../framework/helpers/stock-test-helpers';

test('TC_STOCK_01_02-Khong cho luu hang muc khi thieu don vi ton kho', async ({ itemPage, page }) => {
  const item = buildUniqueItem();

  await itemPage.fillItemForm({
    itemCode: item.itemCode,
    itemGroup: masterData.itemGroup,
    itemName: item.itemName,
    stockUom: masterData.stockUom,
  });

  await page.evaluate(async () => {
    const appWindow = window as typeof window & {
      cur_frm?: {
        dirty: () => void;
        doc: {
          doctype: string;
          name: string;
        };
        refresh_field: (fieldname: string) => void;
      };
      frappe?: {
        model?: {
          set_value: (doctype: string, name: string, fieldname: string, value: unknown) => Promise<unknown> | unknown;
        };
      };
    };

    const form = appWindow.cur_frm;
    const setValue = appWindow.frappe?.model?.set_value;

    if (!form || !setValue) {
      throw new Error('ERPNext form context is not available for Item mutation.');
    }

    await setValue(form.doc.doctype, form.doc.name, 'stock_uom', '');
    form.refresh_field('stock_uom');
    form.dirty();
  });

  await itemPage.save();

  await expectUnsavedNewDocument(page, itemPage, stockNewDocumentUrlPatterns.item);
});
