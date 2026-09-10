const CASE_ITEMS = [')) {
        console.log('Line', count, 'contains CASE_ITEMS in JSON object');
        // Let's check where CASE_ITEMS is in obj
        function searchObj(val) {
          if (typeof val === 'string') {
            const idx = val.indexOf('const CASE_ITEMS = [');
            if (idx !== -1) {
              const endIdx = val.indexOf('];