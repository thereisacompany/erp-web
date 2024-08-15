<template>
    <div>
        <input type="text" v-model="fileUrl" placeholder="Enter file URL" />
        <button @click="loadExcelFromUrl">Load Excel</button>
        <div v-if="excelData.length" id="excel-preview" ref="excelPreview">
            <table>
                <thead>
                    <tr>
                        <th v-for="(header, index) in excelData[0]" :key="index">{{ header }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, rowIndex) in filteredExcelData" :key="rowIndex">
                        <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                            <span v-if="typeof cell === 'string'">{{ cell }}</span>
                            <span v-else>{{ typeof cell }}</span>

                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <button v-if="excelData.length" @click="printTable">Print</button>
    </div>
</template>

<script>
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default {
    data() {
        return {
            fileUrl: '',
            excelData: []
        };
    },
    computed: {
        filteredExcelData() {
            // 這裡假設所有數據行都應顯示。可以根據需要添加過濾邏輯
            return this.excelData.slice(1);
        }
    },
    methods: {
        async loadExcelFromUrl() {
            try {
                const response = await fetch(this.fileUrl);
                const arrayBuffer = await response.arrayBuffer();
                const data = new Uint8Array(arrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const sheetData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
                console.log("firstSheet", firstSheet)
                const images = this.extractImages();

                const formattedData = sheetData.map(row => {
                    return row.map(cell => {
                        if (images[cell]) {
                            return images[cell];
                        }
                        return cell;
                    });
                });

                this.excelData = formattedData;
            } catch (error) {
                console.error('Error loading Excel from URL:', error);
            }
        },
        extractImages() {
            // 根據需要實現提取圖片的邏輯
            // 簡單示例，假設所有圖片已經提取並放置在一個對象中
            return {
                'image1.png': 'data:image/png;base64,...', // 替換為實際的base64數據
            };
        },
        printTable() {
            html2canvas(this.$refs.excelPreview).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                pdf.addImage(imgData, 'PNG', 0, 0);
                pdf.save('download.pdf');
            });
        }
    }
};
</script>

<style>
table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    border: 1px solid black;
    padding: 8px;
    text-align: left;
}

img {
    max-width: 100px;
    max-height: 100px;
}
</style>