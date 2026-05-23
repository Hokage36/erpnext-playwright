import { expect, Locator, Page } from '@playwright/test';

import { uiText } from '../data/ui-text';
import { BasePage, LocatorPosition } from './base.page';

export class ErpDocumentPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  protected itemGrid(): Locator {
    return this.page.locator('[data-fieldname="items"]').first();
  }

  protected saveButton(): Locator {
    return this.page.getByRole('button', { name: uiText.common.save });
  }

  protected submitButton(): Locator {
    return this.page.getByRole('button', { name: uiText.common.submit });
  }

  protected confirmButton(): Locator {
    return this.page.getByRole('button', { name: uiText.common.confirm });
  }

  async save(): Promise<void> {
    const saveButton = this.saveButton();

    await this.dismissMessageDialogIfPresent();
    await expect(saveButton).toBeVisible();
    await expect(saveButton).toBeEnabled();
    await saveButton.click();
    await this.waitForFreezeToClear();
  }

  async saveUntilSaved(savedUrlPattern: RegExp, attempts = 3): Promise<void> {
    const saveButton = this.saveButton();
    const unsavedBadge = this.page.getByText(uiText.common.unsavedLabelPattern).first();

    for (let attempt = 0; attempt < attempts; attempt += 1) {
      await this.dismissMessageDialogIfPresent();
      await expect(saveButton).toBeVisible();
      await expect(saveButton).toBeEnabled();
      await saveButton.click();
      await this.waitForFreezeToClear();

      const isSavedUrl = savedUrlPattern.test(this.page.url());
      const hasUnsavedBadge = await unsavedBadge.isVisible().catch(() => false);

      if (isSavedUrl && !hasUnsavedBadge) {
        return;
      }
    }

    await expect(this.page).toHaveURL(savedUrlPattern, { timeout: 15000 });
  }

  async submit(): Promise<void> {
    const submitButton = this.submitButton();

    await expect(submitButton).toBeVisible({ timeout: 15000 });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    const confirmButton = this.confirmButton();

    await expect(confirmButton).toBeVisible();
    await expect(confirmButton).toBeEnabled();
    await confirmButton.click();
    await this.waitForFreezeToClear();
  }

  async saveAndSubmit(attempts = 3): Promise<void> {
    const saveButton = this.saveButton();
    const submitButton = this.submitButton();

    for (let attempt = 0; attempt < attempts; attempt += 1) {
      await expect(saveButton).toBeVisible();
      await expect(saveButton).toBeEnabled();
      await saveButton.click();
      await this.waitForFreezeToClear();

      if (await submitButton.isVisible().catch(() => false)) {
        break;
      }

      await submitButton.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});

      if (await submitButton.isVisible().catch(() => false)) {
        break;
      }
    }

    await this.submit();
  }

  async openCreateMenuItem(itemName: string): Promise<void> {
    const createButton = this.page.getByRole('button', { name: uiText.common.create });

    await expect(createButton).toBeVisible({ timeout: 15000 });
    await expect(createButton).toBeEnabled();
    await createButton.click();

    const menuItem = this.page.getByRole('link', { name: itemName, exact: true });

    await expect(menuItem).toBeVisible();
    await menuItem.click();
  }

  // Thu mo document moi truc tiep, neu UI khong cho thi quay ve list va bam Create.
  protected async gotoNewDocumentFromList(newPath: string, listPath: string): Promise<void> {
    await this.goto(newPath);

    if (await this.saveButton().isVisible().catch(() => false)) {
      return;
    }

    await this.goto(listPath);

    if (await this.page.locator('.primary-action:visible').first().isVisible().catch(() => false)) {
      await this.clickPrimaryAction();
      return;
    }

    await this.goto(newPath);
    await expect(this.saveButton()).toBeVisible({ timeout: 15000 });
  }

  // Ten document duoc lay tu URL sau khi ERPNext luu thanh cong.
  currentDocumentName(): string {
    const currentUrl = new URL(this.page.url());
    const segments = currentUrl.pathname.split('/').filter(Boolean);
    const documentName = decodeURIComponent(segments.at(-1) ?? '');

    if (!documentName || documentName.startsWith('new-')) {
      throw new Error(`Current page URL does not point to a saved document: ${this.page.url()}`);
    }

    return documentName;
  }

  // ERPNext hay hien msgprint/modal sau khi save, can dong di de tranh che nut Save/Submit.
  async dismissMessageDialogIfPresent(): Promise<void> {
    await this.waitForFreezeToClear(15000);

    const msgprintDialog = this.page.locator('.modal-dialog.msgprint-dialog').first();
    const msgprintCloseButton = msgprintDialog.locator('.btn.btn-modal-close').first();

    if (await msgprintDialog.isVisible().catch(() => false)) {
      await msgprintCloseButton.click({ timeout: 2000 }).catch(() => {});
      await msgprintDialog.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
      return;
    }

    const messageDialog = this.page.locator('.modal.show').last();
    const messageDialogCloseButton = messageDialog.locator('.modal-header button:visible').last();

    if (await messageDialog.isVisible().catch(() => false)) {
      await messageDialogCloseButton.click({ timeout: 2000 }).catch(() => {});
      await messageDialog.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    }
  }

  async dismissMaterialRequestDialogIfPresent(): Promise<void> {
    const materialRequestDialog = this.page
      .getByRole('dialog')
      .filter({ hasText: uiText.dialogs.materialRequest });

    const isVisible = await materialRequestDialog
      .waitFor({ state: 'visible', timeout: 10000 })
      .then(() => true)
      .catch(() => false);

    if (!isVisible) {
      return;
    }

    const closeButton = materialRequestDialog.locator('.modal-header button:visible').last();

    await expect(closeButton).toBeVisible();
    await closeButton.click();
    await expect(materialRequestDialog).toBeHidden();
  }

  protected async fillAutocompleteField(
    fieldName: string,
    value: string,
    position: LocatorPosition = 'first'
  ): Promise<void> {
    await this.fillAutocomplete(this.autocompleteField(fieldName, position), value);
  }

  protected async fillInputField(
    fieldName: string,
    value: string,
    position: LocatorPosition = 'first'
  ): Promise<void> {
    await this.fillInput(this.inputField(fieldName, position), value);
  }

  protected async selectFieldOption(
    fieldName: string,
    label: string,
    position: LocatorPosition = 'first'
  ): Promise<void> {
    const select = this.selectField(fieldName, position);

    await expect(select).toBeVisible();
    await select.selectOption({ label });
  }

  protected async clickGridCell(selector: string, position: LocatorPosition = 'first'): Promise<void> {
    const locator = this.page.locator(selector);
    const cell = position === 'first' ? locator.first() : locator.last();

    await expect(cell).toBeVisible();
    await cell.click();
  }

  async fillSetWarehouseIfVisible(warehouseName: string): Promise<boolean> {
    const setWarehouseInput = this.autocompleteField('set_warehouse');
    const isVisible = await setWarehouseInput.isVisible().catch(() => false);

    if (!isVisible) {
      return false;
    }

    await this.fillAutocomplete(setWarehouseInput, warehouseName);
    return true;
  }

  async fillRowWarehouse(warehouseName: string): Promise<void> {
    await this.openFirstGridRow();
    await this.fillOpenRowAutocompleteField('warehouse', warehouseName);
    await this.closeOpenGridRow();
  }

  async fillReferenceNumber(value: string): Promise<void> {
    await this.fillInputField('reference_no', value);
  }

  protected async fillGridAutocompleteField(fieldName: string, value: string): Promise<void> {
    await this.fillAutocompleteField(fieldName, value, 'last');
  }

  protected async fillGridInputField(fieldName: string, value: string): Promise<void> {
    await this.fillInputField(fieldName, value, 'last');
  }

  protected async fillDocumentInputFieldWithFallback(
    fieldName: string,
    value: string,
    fallbackLocator: Locator,
    commitKey: 'Enter' | 'Tab' = 'Tab'
  ): Promise<void> {
    let input = fallbackLocator;

    if (!(await input.isVisible().catch(() => false)) || !(await input.isEditable().catch(() => false))) {
      input = this.inputField(fieldName);
    }

    await this.fillInput(input, value);
    await input.press(commitKey);
  }

  protected async fillInlineItemGridAutocompleteField(fieldName: string, value: string): Promise<void> {
    let input = this.itemGrid()
      .locator(`[data-fieldname="${fieldName}"] .input-with-feedback:visible`)
      .first();

    if (!(await input.isVisible().catch(() => false))) {
      input = this.page
        .locator(`[data-fieldname="${fieldName}"] .input-with-feedback:visible`)
        .last();
    }

    await this.fillAutocomplete(input, value);
    await input.press('Tab').catch(() => {});
  }

  protected async fillInlineItemGridInputField(
    fieldName: string,
    value: string,
    commitKey: 'Enter' | 'Tab' = 'Tab'
  ): Promise<void> {
    let input = this.itemGrid().locator(`[data-fieldname="${fieldName}"] input:visible`).first();

    if (!(await input.isVisible().catch(() => false))) {
      input = this.page.locator(`[data-fieldname="${fieldName}"] input:visible`).last();
    }

    await this.fillInput(input, value);
    await input.press(commitKey);
  }

  protected async readInlineItemGridInputValue(fieldName: string): Promise<string> {
    let input = this.itemGrid().locator(`[data-fieldname="${fieldName}"] input:visible`).first();

    if (!(await input.isVisible().catch(() => false))) {
      input = this.page.locator(`[data-fieldname="${fieldName}"] input:visible`).last();
    }

    await expect(input).toBeVisible();
    return input.inputValue();
  }

  protected async fillAllVisibleInputFields(
    fieldName: string,
    value: string,
    commitKey: 'Enter' | 'Tab' = 'Tab'
  ): Promise<number> {
    const inputs = this.page.locator(`[data-fieldname="${fieldName}"] input:visible`);
    const count = await inputs.count();
    let filledCount = 0;

    for (let index = 0; index < count; index += 1) {
      const input = inputs.nth(index);
      const isEditable = await input.isEditable().catch(() => false);

      if (!isEditable) {
        continue;
      }

      await this.fillInput(input, value);
      await input.press(commitKey);
      filledCount += 1;
    }

    return filledCount;
  }

  protected async openFirstGridRow(): Promise<void> {
    const itemGrid = this.itemGrid();
    const openRow = itemGrid.locator('.grid-row-open:visible').first();
    const openModal = this.page.locator('.modal.show:visible').last();

    // Neu row da mo san hoac ERPNext bung row ra modal thi khong mo lai nua.
    if (await openRow.isVisible().catch(() => false)) {
      return;
    }

    if (await openModal.isVisible().catch(() => false)) {
      return;
    }

    let openRowButton = itemGrid.locator('.btn-open-row:visible, .btn-open-row > a:visible').first();

    if (!(await openRowButton.isVisible().catch(() => false))) {
      openRowButton = this.page.locator('.btn-open-row:visible, .btn-open-row > a:visible').first();
    }

    await expect(openRowButton).toBeVisible();
    await openRowButton.click();

    // Tuy layout ERPNext, row co the mo inline hoac mo bang modal.
    const openedInlineRow = await openRow.isVisible().catch(() => false);
    if (openedInlineRow) {
      return;
    }

    await expect(openModal).toBeVisible();
  }

  protected async closeOpenGridRow(): Promise<void> {
    const itemGrid = this.itemGrid();
    const openRow = itemGrid.locator('.grid-row-open:visible').first();
    const openModal = this.page.locator('.modal.show:visible').last();

    // Neu ERPNext mo row bang modal thi dong modal thay vi collapse inline row.
    if (!(await openRow.isVisible().catch(() => false))) {
      if (!(await openModal.isVisible().catch(() => false))) {
        return;
      }

      const modalCloseButton = openModal.locator('.modal-header button:visible').last();
      await expect(modalCloseButton).toBeVisible();
      await modalCloseButton.click();
      await expect(openModal).toBeHidden();
      return;
    }

    let collapseRowButton = itemGrid.locator('.btn.btn-secondary.btn-sm.pull-right:visible').first();

    if (!(await collapseRowButton.isVisible().catch(() => false))) {
      collapseRowButton = this.page.locator('.btn.btn-secondary.btn-sm.pull-right:visible').first();
    }

    await expect(collapseRowButton).toBeVisible();
    await collapseRowButton.click();
    await expect(openRow).toBeHidden();
  }

  protected async fillOpenRowAutocompleteField(fieldName: string, value: string): Promise<void> {
    const openModal = this.page.locator('.modal.show:visible').last();
    if (await openModal.isVisible().catch(() => false)) {
      // Uu tien dien vao modal neu ERPNext khong mo inline row.
      const modalInput = openModal.locator(`[data-fieldname="${fieldName}"] .input-with-feedback:visible`).first();
      await this.fillAutocomplete(modalInput, value);
      await modalInput.press('Tab').catch(() => {});
      return;
    }

    let input = this.itemGrid()
      .locator(`.grid-row-open [data-fieldname="${fieldName}"] .input-with-feedback:visible`)
      .first();

    if (!(await input.isVisible().catch(() => false))) {
      input = this.page
        .locator(`.grid-row-open [data-fieldname="${fieldName}"] .input-with-feedback:visible`)
        .first();
    }

    await this.fillAutocomplete(input, value);
    await input.press('Tab').catch(() => {});
  }

  protected async fillOpenRowInputField(
    fieldName: string,
    value: string,
    commitKey: 'Enter' | 'Tab' = 'Tab'
  ): Promise<void> {
    const openModal = this.page.locator('.modal.show:visible').last();
    if (await openModal.isVisible().catch(() => false)) {
      // Cung mot y tuong nhu tren, nhung dung cho input thuong thay vi autocomplete.
      const modalInput = openModal.locator(`[data-fieldname="${fieldName}"] input:visible`).first();
      await this.fillInput(modalInput, value);
      await modalInput.press(commitKey);
      return;
    }

    let input = this.itemGrid().locator(`.grid-row-open [data-fieldname="${fieldName}"] input:visible`).first();

    if (!(await input.isVisible().catch(() => false))) {
      input = this.page.locator(`.grid-row-open [data-fieldname="${fieldName}"] input:visible`).first();
    }

    await this.fillInput(input, value);
    await input.press(commitKey);
  }
}
