const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');

(async () => {
    const server = spawn('python3', ['-m', 'http.server', '8765', '--bind', '127.0.0.1', '--directory', 'public'], { stdio: 'ignore' });
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('dialog', dialog => dialog.accept());
        await page.goto('http://127.0.0.1:8765', { waitUntil: 'domcontentloaded' });
        await page.locator('[data-producto="Camisas"]').click();
        await page.locator('#cantidadProducto').fill('2');
        await page.locator('#personalizacionProducto').fill('Mi camisa');
        await page.locator('#agregarCarrito').click();
        await page.locator('#carritoModal.activo').waitFor();
        assert.equal(await page.locator('#contadorCarrito').textContent(), '2');
        assert.equal(await page.locator('#carritoTotal').textContent(), 'L.900');
        await page.reload({ waitUntil: 'domcontentloaded' });
        assert.equal(await page.locator('#contadorCarrito').textContent(), '2');
        await page.locator('#abrirCarrito').click();
        await page.locator('.mas').click();
        assert.equal(await page.locator('#contadorCarrito').textContent(), '3');
        await page.locator('.menos').click();
        await page.locator('#finalizarPedido').click();
        await page.locator('#clienteModal.activo').waitFor();
        await page.locator('#clienteNombre').fill('Cliente de prueba');
        await page.locator('#clienteTelefono').fill('99999999');
        await page.evaluate(() => { window.open = url => { window.pedidoEnviado = url; }; });
        await page.locator('#formCliente button[type="submit"]').click();
        const url = await page.evaluate(() => window.pedidoEnviado);
        assert.match(url, /^https:\/\/wa.me\//);
        assert.match(decodeURIComponent(url), /Mi camisa/);
        await page.keyboard.press('Escape');
        await page.locator('[data-producto="Placas"]').click();
        await page.locator('#tipoPlaca').selectOption('Carro');
        assert.equal(await page.locator('#modalPrecio').textContent(), 'L.3,500');
        await page.keyboard.press('Escape');
        const thumbnail = page.locator('.miniatura').nth(1);
        const image = await thumbnail.getAttribute('data-imagen');
        await thumbnail.click();
        assert.equal(await thumbnail.locator('xpath=ancestor::div[contains(@class,"producto-galeria")]').locator('.imagen-principal').getAttribute('src'), image);
        await page.setViewportSize({ width: 390, height: 844 });
        await page.locator('#menuToggle').click();
        assert.equal(await page.locator('#menuToggle').getAttribute('aria-expanded'), 'true');
        assert.deepEqual(errors, []);
        console.log('Productos, carrito, persistencia, WhatsApp, placas, galeria y menu: OK');
    } finally {
        if (browser) await browser.close();
        server.kill();
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
