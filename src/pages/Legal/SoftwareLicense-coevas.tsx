import styles from "./SoftwareLicense-coevas.module.css";

export default function License() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className={styles.header}>
          <h1 className={styles.headerTitle}>
            License Agreement
          </h1>

          <p className={styles.headerSub}>
            Coevas Panel by{" "}
            <span className={styles.headerBrand}>
              Openroot Systems
            </span>
          </p>

          <div className={styles.headerDivider} />
        </div>

        {/* =====================================================
            INTRO
        ====================================================== */}

        <section className={styles.section}>
          <p className={styles.para}>
            This End User License Agreement ("Agreement") is a legal agreement
            between you ("User", "You") and{" "}
            <strong>Openroot Systems</strong> ("Company", "We", "Us") governing
            your use of the software product{" "}
            <strong>Coevas Panel</strong> ("Software").
          </p>

          <p className={styles.para}>
            By downloading, installing, or using the Software, you agree to be
            bound by the terms of this Agreement. If you do not agree to these
            terms, do not install or use the Software.
          </p>
        </section>

        {/* =====================================================
            1. GRANT OF LICENSE
        ====================================================== */}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            1. Grant of License
          </h2>

          <p className={styles.para}>
            Openroot Systems grants you a limited, non-exclusive,
            non-transferable, and revocable license to install and use the
            Software solely for your internal or personal use, in accordance
            with this Agreement.
          </p>
        </section>

        {/* =====================================================
            2. RESTRICTIONS
        ====================================================== */}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            2. Restrictions
          </h2>

          <ul className={styles.list}>
            <li className={styles.listItem}>
              You may not copy, modify, adapt, or create derivative works of
              the Software.
            </li>

            <li className={styles.listItem}>
              You may not reverse engineer, decompile, or disassemble the
              Software.
            </li>

            <li className={styles.listItem}>
              You may not redistribute, sell, sublicense, rent, lease, or
              transfer the Software to any third party.
            </li>

            <li className={styles.listItem}>
              You may not remove or alter any copyright or proprietary notices.
            </li>
          </ul>
        </section>

        {/* =====================================================
            3. OWNERSHIP
        ====================================================== */}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            3. Ownership and Intellectual Property
          </h2>

          <p className={styles.para}>
            The Software is licensed, not sold. All rights, title, and interest
            in and to the Software, including all intellectual property rights,
            are and shall remain the exclusive property of Openroot Systems.
          </p>
        </section>

        {/* =====================================================
            4. UPDATES
        ====================================================== */}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            4. Updates and Modifications
          </h2>

          <p className={styles.para}>
            Openroot Systems may provide updates, patches, or new versions of
            the Software from time to time. This Agreement shall apply to all
            such updates unless accompanied by a separate license agreement.
          </p>
        </section>

        {/* =====================================================
            5. DISCLAIMER
        ====================================================== */}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            5. Disclaimer of Warranty
          </h2>

          <p className={styles.para}>
            The Software is provided "AS IS" and "AS AVAILABLE", without
            warranty of any kind, express or implied, including but not limited
            to the warranties of merchantability, fitness for a particular
            purpose, and non-infringement. You use the Software at your own
            risk.
          </p>
        </section>

        {/* =====================================================
            6. LIMITATION OF LIABILITY
        ====================================================== */}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            6. Limitation of Liability
          </h2>

          <p className={styles.para}>
            To the maximum extent permitted by law, Openroot Systems shall not
            be liable for any indirect, incidental, special, consequential, or
            punitive damages arising out of or related to your use or inability
            to use the Software.
          </p>
        </section>

        {/* =====================================================
            7. TERMINATION
        ====================================================== */}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            7. Termination
          </h2>

          <p className={styles.para}>
            This Agreement is effective until terminated. Your rights under
            this Agreement will terminate automatically without notice if you
            fail to comply with any term of this Agreement. Upon termination,
            you must cease all use of the Software and destroy all copies in
            your possession.
          </p>
        </section>

        {/* =====================================================
            8. GOVERNING LAW
        ====================================================== */}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            8. Governing Law
          </h2>

          <p className={styles.para}>
            This Agreement shall be governed by and construed in accordance
            with the laws applicable in your jurisdiction, without regard to
            conflict of law principles.
          </p>
        </section>

        {/* =====================================================
            9. CONTACT
        ====================================================== */}

        <section className={styles.sectionLast}>
          <h2 className={styles.sectionTitle}>
            9. Contact Information
          </h2>

          <p className={styles.para}>
            If you have any questions about this Agreement, please contact:
          </p>

          <p className={styles.contactBlock}>
            Openroot Systems
            <br />
            Website:{" "}
            <a
              href="https://openroot.in"
              target="_blank"
              rel="noreferrer"
              className={styles.contactLink}
            >
              https://openroot.in
            </a>
          </p>
        </section>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <footer className={styles.footer}>
          © 2026 Openroot Systems. All rights reserved.
        </footer>

      </div>
    </div>
  );
}