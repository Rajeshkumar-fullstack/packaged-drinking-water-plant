const fs = require('fs');

let html = fs.readFileSync('water-cans.html', 'utf8');

const target20L = `<div class="grid-2" id="can20L" style="margin-bottom:5rem; scroll-margin-top:90px;">`;
const new20L = `<div class="grid-2" id="can20L" style="margin-bottom:5rem; scroll-margin-top:100px;">
          <div class="reveal-left">
            <div class="img-glow-card" style="background:radial-gradient(circle at 50% 45%, #FFFFFF 0%, rgba(235, 248, 252, 0.95) 55%, rgba(214, 242, 250, 0.9) 100%); border-radius:24px; border:2px solid rgba(36, 189, 232, 0.35); box-shadow:0 15px 35px rgba(18, 169, 214, 0.18);">
              <img src="assets/images/polycarbonate-20l-bubbletop.png" alt="20L Standard Commercial Water Can" loading="lazy" style="width:100%; height:420px; object-fit:contain; padding:2.2rem;" decoding="async">
            </div>
          </div>
          <div class="reveal-right">
            <div class="badge-pill"><i class="bi bi-star-fill"></i> Most Popular • Enterprise Standard</div>
            <h2 class="section-title" style="font-size:2.2rem;">20L Standard Commercial Water Can</h2>
            <p style="font-weight:500; color:var(--heading);">
              Heavy-gauge, unbreakable food-grade polycarbonate and virgin PET container. Rigorously sanitized inside and out through high-pressure hot water, alkaline wash, and ozonated rinse prior to touchless filling.
            </p>
            <p>
              The industry gold standard for corporate headquarters, co-working spaces, hospitals, manufacturing shops, and large households. Fits standard floor-standing hot & cold water dispensers.
            </p>
            <table class="clean-table reveal-up" style="margin-block:1.5rem;">
              <tbody>
                <tr>
                  <td><strong>Nominal Volume</strong></td>
                  <td>20.0 Litres (±0.2L)</td>
                </tr>
                <tr>
                  <td><strong>Material Specification</strong></td>
                  <td>100% Virgin BPA-Free Food Grade Polycarbonate / PET</td>
                </tr>
                <tr>
                  <td><strong>Neck Finish & Cap</strong></td>
                  <td>55mm Non-Spill Snap-On Cap with Tamper-Evident Heat Shrink Seal</td>
                </tr>
                <tr>
                  <td><strong>Sanitization Protocol</strong></td>
                  <td>7-Stage Internal High-Pressure Wash with Medical Ozone Rinse</td>
                </tr>
                <tr>
                  <td><strong>Cooler Compatibility</strong></td>
                  <td>Fits All Standard Floor-Standing & Tabletop Water Coolers</td>
                </tr>
                <tr>
                  <td><strong>Batch Traceability</strong></td>
                  <td>Batch QR Code Traceability, 0 CFU Microbes, Zero Manual Touch</td>
                </tr>
                <tr>
                  <td><strong>Recommended Consumption</strong></td>
                  <td>Within 21 days from manufacturing timestamp</td>
                </tr>
              </tbody>
            </table>
            <div style="display:flex; gap:0.75rem; flex-wrap:wrap; margin-top:1rem;">
              <button type="button" class="btn btn-primary btn-add-cart" data-id="can-20l" data-name="20L Commercial Water Can" data-price="90" data-unit="Can" data-img="assets/images/polycarbonate-20l-bubbletop.png">
                <i class="bi bi-cart-plus"></i> Add to Cart (₹90)
              </button>
              <button type="button" class="btn btn-outline" data-modal-open="#quoteModal" data-product="20L Water Can">
                Bulk Quote
              </button>
            </div>
          </div>
        </div>`;

const target10L = `<div class="grid-2" id="can10L" style="scroll-margin-top:90px;">`;
const new10L = `<div class="grid-2" id="can10L" style="scroll-margin-top:100px;">
          <div class="reveal-left">
            <div class="badge-pill"><i class="bi bi-hand-index-thumb-fill"></i> Compact & Ergonomic • Domestic Standard</div>
            <h2 class="section-title" style="font-size:2.2rem;">10L Compact Easy-Carry Water Can</h2>
            <p style="font-weight:500; color:var(--heading);">
              Designed for modern apartments, small executive cabins, clinic suites, and outdoor weekend travel. Lightweight build with integrated molded handle for strain-free lifting and inverted dispenser mounting.
            </p>
            <p>
              Half the weight of a standard 20L can, making loading and lifting effortless without back strain. Perfect for countertop stands or hand-pump dispensers in compact residential kitchens.
            </p>
            <table class="clean-table reveal-up" style="margin-block:1.5rem;">
              <tbody>
                <tr>
                  <td><strong>Nominal Volume</strong></td>
                  <td>10.0 Litres (±0.1L)</td>
                </tr>
                <tr>
                  <td><strong>Handle Structure</strong></td>
                  <td>Integrated Molded Ergonomic Side Handle for strain-free lifting</td>
                </tr>
                <tr>
                  <td><strong>Material Specification</strong></td>
                  <td>Food-Grade Virgin Polymer (BPA & Phthalate-Free)</td>
                </tr>
                <tr>
                  <td><strong>Dispenser Support</strong></td>
                  <td>Direct Table-Top Inverted Stand or Hand-Pump Compatible</td>
                </tr>
                <tr>
                  <td><strong>Total Filled Weight</strong></td>
                  <td>Approx. 10.4 kg (Easy single-person maneuverability)</td>
                </tr>
                <tr>
                  <td><strong>Safety Seal</strong></td>
                  <td>Laser-Engraved Batch Cap with Tear-Off Strip & Tamper Seal</td>
                </tr>
                <tr>
                  <td><strong>Quality Standards</strong></td>
                  <td>7-Stage High-Pressure Sanitization, BIS & FSSAI Compliant</td>
                </tr>
              </tbody>
            </table>
            <div style="display:flex; gap:0.75rem; flex-wrap:wrap; margin-top:1rem;">
              <button type="button" class="btn btn-primary btn-add-cart" data-id="can-10l" data-name="10L Compact Water Can" data-price="55" data-unit="Can" data-img="assets/images/pet-20l-dispenser-jar.png">
                <i class="bi bi-cart-plus"></i> Add to Cart (₹55)
              </button>
              <button type="button" class="btn btn-outline" data-modal-open="#quoteModal" data-product="10L Water Can">
                Bulk Quote
              </button>
            </div>
          </div>
          <div class="reveal-right">
            <div class="img-glow-card" style="background:radial-gradient(circle at 50% 45%, #FFFFFF 0%, rgba(235, 248, 252, 0.95) 55%, rgba(214, 242, 250, 0.9) 100%); border-radius:24px; border:2px solid rgba(36, 189, 232, 0.35); box-shadow:0 15px 35px rgba(18, 169, 214, 0.18);">
              <img src="assets/images/pet-20l-dispenser-jar.png" alt="10L Compact Easy-Carry Water Can" loading="lazy" style="width:100%; height:420px; object-fit:contain; padding:2.2rem;" decoding="async">
            </div>
          </div>
        </div>`;

// Replace from target20L to the start of target10L
const start20Idx = html.indexOf(target20L);
const start10Idx = html.indexOf(target10L);
const end10Idx = html.indexOf('<!-- 7-Stage Can Washing');

if (start20Idx !== -1 && start10Idx !== -1 && end10Idx !== -1) {
  const updated = html.slice(0, start20Idx) + new20L + '\n\n        <!-- 10L Model -->\n        ' + new10L + '\n      </div>\n    </section>\n\n    ' + html.slice(end10Idx);
  fs.writeFileSync('water-cans.html', updated, 'utf8');
  console.log('Successfully updated water-cans.html!');
} else {
  console.error('Could not locate indices in water-cans.html', { start20Idx, start10Idx, end10Idx });
}
