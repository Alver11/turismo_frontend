<script setup lang="ts">
import { useApi } from '/@src/composable/useApi'
import { hasPermission } from '/@src/utils/permissions'
import axios from 'axios'
import { useUserSession } from '/@src/stores/userSession'
import DataTable from 'datatables.net-vue3'
import DataTablesCore, { type Config } from 'datatables.net'
import DataTableButtons from 'datatables.net-buttons'
import * as XLSX from 'xlsx'
const pdfMake = require('pdfmake/build/pdfmake')
//import pdfMake from 'pdfmake/build/pdfmake'
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
import 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
import 'datatables.net-buttons/js/buttons.html5.js'
import 'datatables.net-buttons/js/buttons.print.js'
import 'datatables.net-buttons/js/buttons.colVis.js'
import 'https://code.jquery.com/jquery-3.7.1.min.js'
import 'https://bartaz.github.io/sandbox.js/jquery.highlight.js'
import 'datatables.net-select'
import 'datatables.net-responsive'
import 'datatables.net-colreorder-dt'
import '/@src/scss/components/_tableJquery.scss'
import logo from '/@src/assets/logo/logo_cordillera.png'
import { useNotyf } from '/@src/composable/useNotyf'

DataTable.use(pdfMake)
pdfMake.vfs = pdfFonts.pdfMake.vfs
DataTable.use(DataTablesCore)
DataTable.use(DataTableButtons)

const userSession = useUserSession()
let cancelSource = axios.CancelToken.source()
const notify = useNotyf()
let dt: any
const props = defineProps({
  columnId: {
    type: String,
    default: () => 'id',
  },
  columns: {
    type: Array,
    default: () => [],
  },
  serverSideUrl: {
    type: String,
    default: '',
  },
  buttonTable: {
    type: Array,
    default: () => []
  },
  searchColumns: {
    type: Boolean,
    default: false,
  },
  groupColumn: {
    type: Boolean,
    default: false,
  },
  moveColumn: {
    type: Boolean,
    default: false,
  },
  updateTableEvent: {
    type: Boolean,
    default: true,
  },
})
const emit = defineEmits(['view', 'edit', 'delete', 'infoTable'])
const groupRows = ref(false)
const groupCheck = ref(false)
const searchColumn = ref(false)
const smallFormOpen = ref(false)
const exportPdfAllData = ref(false)
const exportPdfAddNumber = ref(true)
const modelExportExcel = ref(false)
const exportExcelAllData = ref(false)
const exportExcelAddNumber = ref(false)
const sizePage = ref('A4')
const table = ref()
const orientation = ref<string>('Vertical')
const description = ref('')
const observation = ref('')
const logoDataUrl = ref()
const augmentedColumns = [
  ...props.columns,
  {
    className: 'dt-center editor-edit noVis',
    orderable: false,
    searchable: false,
    defaultContent: '<i class="fa fa-pen"/>',
    data: props.columnId,
    render: function (data: any) {
      let buttons = `<div class="action-button">`
      props.buttonTable.forEach(button => {
        if(button.button == 'view' && hasPermission(button.permission)){
          buttons =
            buttons +
            `<button data-id="${data}" class="button is-dark-bg-1 is-info is-light" id="view">
            <i class="iconify" data-icon="feather:eye" aria-hidden="true"></i>
          </button>`
        }
        if(button.button == 'edit' && hasPermission(button.permission)){
          buttons =
            buttons +
            `<button data-id="${data}" class="button is-dark-bg-1 is-warning is-light" id="edit">
            <i class="iconify" data-icon="feather:edit" aria-hidden="true"></i>
          </button>`
        }
        if(button.button == 'delete' && hasPermission(button.permission)){
          buttons =
            buttons +
            `<button data-id="${data}" class="button is-dark-bg-1 is-danger is-light" id="delete">
                <i class="iconify" data-icon="feather:trash-2" aria-hidden="true"></i>
             </button>`
        }
      })
      return buttons + `</div>`
    },
    exportable: false,
  },
]
const options = ref({
  columns: augmentedColumns,
  lengthChange: true,
  lengthMenu: [
    [10, 25, 50, 100],
    [
      '10 resultados por página',
      '25 resultados por página',
      '50 resultados por página',
      '100 resultados por página',
    ],
  ],
  colReorder: props.moveColumn,
  dom: 'Blfrtip',
  select: true,
  buttons: [
    {
      extend: 'excelHtml5',
      className: 'btn-excel',
      exportOptions: {
        rows: function (idx: any, data: any, node: any) {
          if (node && $(node).length > 0) {
            return $(node).css('display') !== 'none'
          }
          return false
        },
      },
    },
    {
      extend: 'pdfHtml5',
      className: 'btn-pdf',
      action: function (e: any, dt: any) {
        openPrint(dt)
      },
    },
    {
      extend: 'colvis',
      text: '<i class="lnir lnir-layers" aria-hidden="true"></i>',
      className: 'btn-show-hide',
      columns: ':not(.noVis)',
    },
    {
      className: 'btn-reset',
      action: function () {
        resetTable()
      },
    },
  ],
  processing: true,
  serverSide: true,
  language: {
    url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json',
    lengthMenu: '_MENU_',
    search: ' ',
    searchPlaceholder: 'Buscar...',
    select: {
      rows: '',
      columns: '',
      cells: '',
    },
  },
  searchHighlight: true,
  responsive: {
    details: {
      renderer: function (api: any, rowIdx: any, columns: any) {
        const data = $.map(columns, function (col) {
          return col.hidden
            ? '<tr data-dt-row="' +
            col.rowIndex +
            '" data-dt-column="' +
            col.columnIndex +
            '">' +
            '<td class="dtr-title">' +
            col.title +
            ':' +
            '</td> ' +
            '<td>' +
            col.data +
            '</td>' +
            '</tr>'
            : ''
        }).join('')
        return data ? $('<table/>').append(data) : false
      },
    },
  },
  columnDefs: [
    { responsivePriority: 2, targets: 0 },
    { responsivePriority: 1, targets: -1 },
    {
      targets: 1, // Índice de la columna que deseas modificar
      width: 200, // Ancho deseado para la columna en píxeles o cualquier otra unidad válida de CSS
    },
    {
      targets: '_all',
      render: function(data: any, type: any) {
        if (data != null) {
          return type === 'display' && data.length > 100
            ? '<div style="width: 400px; overflow: hidden; text-overflow: ellipsis;">' +
            data +
            '</div>'
            : data
        } else {
          return data
        }
      },
    },
  ],
  stateSave: true,
  search: true,
  order: [[0, 'desc']],
  stateSaveCallback: function (settings: any, data: any) {
    localStorage.setItem('DataTables_' + props.serverSideUrl, JSON.stringify(data))
  },
  stateLoadCallback: function () {
    const savedState = localStorage.getItem('DataTables_' + props.serverSideUrl)
    return savedState ? JSON.parse(savedState) : null
  },
  ajax: (data: any, callback: any) => {
    if (groupRows.value) {
      groupRows.value = false
    }
    const apiInstance = useApi()
    // Cancela la solicitud anterior antes de realizar una nueva
    cancelSource.cancel('Se cancela la solicitud anterior')

    const newCancelSource = axios.CancelToken.source()
    cancelSource = newCancelSource
    apiInstance
      .get('/' + props.serverSideUrl, {
        params: data,
        cancelToken: newCancelSource.token,
      })
      .then((response) => {
        callback({
          draw: response.data.draw,
          recordsTotal: response.data.recordsTotal,
          recordsFiltered: response.data.recordsFiltered,
          data: response.data.data,
        })
        if (!groupRows.value || groupCheck.value) {
          groupRows.value = false
        }
      })
      .catch((error) => {
        console.error('Error:', error)
      })
    $(document).on('click', '#view', function () {
      let id = $(this).data('id')
      emit('view', id)
    })
    $(document).on('click', '#edit', function () {
      let id = $(this).data('id')
      emit('edit', id)
    })
    $(document).on('click', '#delete', function () {
      let id = $(this).data('id')
      emit('delete', id)
    })
  },
}) as Config
const dataExport = ref()
const isLoading = ref(false)
function openPrint(dt: any) {
  smallFormOpen.value = true
  dataExport.value = dt
}

function getNestedPropertyValue(obj: any, path: string): any {
  const keys = path.split('.')
  let value = obj

  for (const key of keys) {
    if (value && key in value) {
      value = value[key]
    } else {
      return null
    }
  }

  if (Array.isArray(value)) {
    return value.map(item => item.name).filter(name => name != null).join(', ')
  }

  if (value && typeof value === 'object' && 'name' in value) {
    return value.name
  }

  return value
}

async function generateAndOpenPDF() {
  const dte = dataExport.value
  isLoading.value = true
  let searchParams = dt.ajax.params()
  searchParams.start = 0
  searchParams.length = 5000

  const dataAll = dte.buttons.exportData({
    columns: '.show-columns:not(.noVis)',
  })
  const body = [dataAll.header]
  let numberedBody: any[]

  if (exportPdfAllData.value) {
    let columnDataNames = dte
      .columns()
      .header()
      .filter(function (idx: number) {
        let header = $(dte.column(idx).header())
        return header.hasClass('show-columns') && !header.hasClass('noVis')
      })
      .map(function (idx: number) {
        return dte.column(idx).dataSrc()
      })
      .toArray()
    const apiInstance = useApi()
    const heads = exportPdfAddNumber.value ? ['#', ...dataAll.header] : dataAll.header
    const result = await apiInstance
      .get('/' + props.serverSideUrl, {
        params: searchParams,
      })
      .then((response) => {
        return response.data.data.map((row: any, idx: number) => {
          let filteredRow: any = {}
          if (exportPdfAddNumber.value) {
            filteredRow = { '#': idx + 1 }
          }
          columnDataNames.forEach((columnName: string) => {
            filteredRow[columnName] = getNestedPropertyValue(row, columnName)
          })
          return filteredRow
        })
      })
      .catch((error) => {
        isLoading.value = false
        notify.error(error)
        console.error('Error:', error)
        return null
      })

    if (exportPdfAddNumber.value) {
      columnDataNames.unshift('#')
    }
    const combinedData = [heads, ...result].map((fila, idx: number) => {
      const rowData: any = {}
      columnDataNames.forEach((columnName: any, index: number) => {
        if (idx == 0) {
          rowData[columnName] = fila[index]
        } else {
          rowData[columnName] = fila[columnName]
        }
      })
      return rowData
    })
    numberedBody = combinedData.map((fila, index) => {
      return columnDataNames.map((columnName: any) => {
        return { text: fila[columnName], style: index === 0 ? 'headerBody' : 'body' }
      })
    })
  } else {
    const allRows = $(dte.table().node()).find('tbody tr')
    dataAll.body.forEach(function (fila: any, index: any) {
      if ($(allRows[index]).css('display') !== 'none') {
        body.push(fila)
      }
    })

    if (exportPdfAddNumber.value) {
      numberedBody = body.map((fila, index) => {
        if (index == 0) {
          fila.unshift('#').toString()
        } else {
          fila.unshift(index.toString())
        }
        return fila
      })
    } else {
      numberedBody = body
    }
  }

  let pageOrientation = 'landscape'
  if (orientation.value == 'Vertical') {
    pageOrientation = 'portrait'
  }

  const numberColumn = numberedBody[0].length
  let widthsColumns: any
  if (numberColumn > 5) {
    widthsColumns = Array(numberColumn).fill('auto')
  } else {
    widthsColumns = Array(numberColumn).fill('*')
    if (exportPdfAddNumber.value) {
      widthsColumns[0] = 'auto'
    }
  }
  const currentDate = new Date()
  const formattedDate = formatDate(currentDate, true)
  const docDefinition = {
    pageSize: sizePage.value,
    pageOrientation: pageOrientation,
    pageMargins: [40, 120, 40, 40],
    header: function () {
      return [
        {
          margin: [40, 10, 10, 10],
          stack: [
            {
              image: logoDataUrl.value,
              width: 200,
              alignment: 'left',
            },
            {
              text: $(document).prop('title'),
              style: 'headerTitle',
              alignment: 'center',
              margin: [0, 10, 0, 0],
            },
            {
              text: description.value,
              style: 'headerSubtitle',
              alignment: 'center',
              margin: [0, 5, 0, 5],
            },
          ],
          width: '*',
        },
      ]
    },
    footer: function (currentPage: any, pageCount: any, pageSize: any) {
      return {
        margin: [50, 0],
        stack: [
          {
            canvas: [
              {
                type: 'line',
                x1: 0,
                y1: 0,
                x2: pageSize.width - 2 * 50, // Ancho de la página - márgenes izquierdo y derecho
                y2: 0,
                lineWidth: 0.5,
              },
            ],
          },
          {
            columns: [
              {
                text: 'Emitido por: ' + userSession.user!.name + ', el ' + formattedDate,
                alignment: 'left',
                style: 'footer',
              },
              {
                text: 'Sistema-RUP',
                alignment: 'center',
                style: 'footer',
              },
              {
                text: 'Página ' + currentPage.toString() + ' de ' + pageCount,
                alignment: 'right',
                style: 'footer',
              },
            ],
          },
        ],
      }
    },
    content: [
      {
        table: {
          headerRows: 1,
          dontBreakRows: true,
          widths: widthsColumns,
          margin: [0, 10, 0, 20],
          body: exportPdfAllData.value
            ? numberedBody
            : numberedBody.map((fila, index) => {
              return fila.map((cell: any) => {
                return { text: cell, style: index === 0 ? 'headerBody' : 'body' }
              })
            }),
        },
      },
      {
        text:
          observation.value !== null && observation.value !== ''
            ? 'Observación: ' + observation.value
            : '',
        style: { italics: true },
        fontSize: 9,
        margin: [0, 40, 0, 0],
      },
    ],
    styles: {
      headerTitle: {
        fontSize: 12,
        bold: true,
      },
      headerSubtitle: {
        fontSize: 10,
        italics: true,
      },
      headerSectionTitle: {
        fontSize: 12,
        bold: true,
        decoration: 'underline',
        margin: [0, 5, 0, 5],
      },
      headerInfo: {
        fontSize: 8,
      },
      header: {
        fontSize: 16,
        bold: true,
      },
      footer: {
        fontSize: 10,
        marginTop: 5,
      },
      headerBody: {
        fillColor: '#CCCCCC',
        fontSize: 10,
        bold: true,
        margin: [0, 0, 0, 0],
        alignment: 'center',
      },
      body: {
        color: '#000000',
        fontSize: 10,
      },
      tableCell: {
        fontSize: 9,
        margin: [2, 2, 2, 2],
      },
    },
  } as any
  const pdf = pdfMake.createPdf(docDefinition)
  smallFormOpen.value = false
  isLoading.value = false
  pdf.open()
}

function updateTable() {
  dt.ajax.reload(null, false)
}

function resetTable() {
  dt.state.clear()
  window.location.reload()
}

/*function placeLoad(status: boolean) {
  if (status) {
    let heightRows = 32
    if (dt.rows().length > 0) {
      heightRows = $(dt.row(0).node()).height() ? $(dt.row(0).node()).height() - 15 : 32
      dt.rows().nodes().to$().hide()
      $('#placeload').remove()
    }
    let columnDataNames = dt
      .columns()
      .header()
      .filter(function (idx: number) {
        let header = $(dt.column(idx).header())
        return header.hasClass('show-columns') && !header.hasClass('dtr-hidden')
      })
      .toArray()
    const body = $('.dataTable')
    const rows = $('<tbody id="placeload"></tbody>').appendTo(body)
    for (let i = 0; i < 10; i++) {
      const cells = $('<tr></tr>').appendTo(rows)
      columnDataNames.forEach(function (this: any) {
        $(
          '<td><div data-v-8dbe572f="" class="content-shape loads mx-2" style="--0a67596d: 20%;--28b4da60: 25px;--ebaac1f0: 20%;--0215286d: 25px;height: ' +
          heightRows +
          'px;"></div></td>'
        ).appendTo(cells)
      })
    }
  } else {
    $('#placeload').remove()
  }
}*/

function checkGroupRows() {
  if (groupRows.value) {
    if (groupCheck.value) {
      dt.draw(false)
      groupCheck.value = false
    }
    let count = 1
    let lastRow = 0
    const noVisColumnIndices = dt.columns('.noVis').indexes().toArray()

    dt.rows().every(function (rowIdx: any) {
      if (rowIdx > 0) {
        const currentRow = dt.row(rowIdx).node()
        let isRowIdentical = true

        dt.columns().every(function (colIdx: any) {
          if (dt.column(colIdx).visible() && !noVisColumnIndices.includes(colIdx)) {
            const cellData = dt.cell(rowIdx, colIdx).data()
            const prevCellData = dt.cell(lastRow, colIdx).data()
            if (cellData !== prevCellData) {
              isRowIdentical = false
              return false
            }
          }
        })

        if (isRowIdentical) {
          groupCheck.value = true
          count++
          $(currentRow).hide()
          $(dt.row(lastRow).node()).find('td.noVis .action-button').css('display', 'none')
          $(dt.row(lastRow).node())
            .find('td.noVis')
            .css('text-align', 'right')
            .text('Total (' + count + ')')
        } else {
          count = 1
          lastRow = rowIdx
        }
      }
    })
  } else {
    if (groupCheck.value) {
      dt.draw(false)
      groupCheck.value = false
    }
  }
}

function searchAdvanced() {
  if (searchColumn.value) {
    dt.columns().every(function (this: any) {
      const column = this
      const header = $(column.header())
      const columnData = dt.settings()[0].aoColumns[column.index()]
      const state = dt.state()
      if (columnData.bSearchable) {
        if (columnData.typeSearch === 'input') {
          const inputContainer = $('<div class="input-container"></div>').appendTo(header)
          const input = $('<input class="search-input">')
            .appendTo(inputContainer)
            .on('input', function () {
              column.search($(this).val()).draw()
            })
            .on('click', function (event) {
              event.stopPropagation()
            })
          if (state && state.columns && state.columns[column.index()].search.search) {
            input.val(state.columns[column.index()].search.search)
          }
        } else if (columnData.typeSearch === 'select') {
          const selectContainer = $('<div class="select-container"></div>').appendTo(
            header
          )
          const select = $('<select><option value=""></option></select>')
            .appendTo(selectContainer)
            .on('change', function () {
              const val = $(this).val()
              column.search(val ? '^' + val + '$' : '', true, false).draw()
            })
            .on('click', function (event) {
              event.stopPropagation()
            })
          columnData.valueSearch.forEach((data: any) => {
            select.append('<option value="' + data.value + '">' + data.text + '</option>')
          })
          if (state && state.columns && state.columns[column.index()].search.search) {
            // Extrae solo la parte relevante del término de búsqueda para establecer el valor del select
            const searchTerm = state.columns[column.index()].search.search
            const match = searchTerm.match(/^\^(.*)\$$/) // Suponiendo que estás guardando el término de búsqueda como una expresión regular
            if (match) {
              select.val(match[1]).trigger('change')
            } else {
              select.val(searchTerm).trigger('change')
            }
          }
        }
      }
    })
  } else {
    let callApi = false
    const state = dt.state()
    dt.columns().every(function (this: any, index: number) {
      const column = this
      const header = $(column.header())
      if (state.columns[index].search.search) {
        callApi = true
      }
      header.find('.input-container').remove()
      header.find('.select-container').remove()
      column.search('')
    })
    if (callApi) {
      dt.ajax.reload(null, false)
    }
  }
}

const modelExcel = () => {
  modelExportExcel.value = true
}

const exportToExcel = async () => {
  isLoading.value = true
  let searchParams = dt.ajax.params()
  searchParams.start = 0
  searchParams.length = -1

  let columnTitles = dt
    .columns()
    .header()
    .filter(function (idx: number) {
      let header = $(dt.column(idx).header())
      return header.hasClass('show-columns') && !header.hasClass('noVis')
    })
    .map(function (idx: number) {
      return $(dt.column(idx).header()).text()
    })
    .toArray()

  if (exportExcelAddNumber.value) {
    columnTitles.unshift('#')
  }

  let columnDataNames = dt
    .columns()
    .header()
    .filter(function (idx: number) {
      let header = $(dt.column(idx).header())
      return header.hasClass('show-columns') && !header.hasClass('noVis')
    })
    .map(function (idx: number) {
      return dt.column(idx).dataSrc()
    })
    .toArray()

  let filteredData: any

  if (exportExcelAllData.value) {
    const apiInstance = useApi()
    filteredData = await apiInstance
      .get('/' + props.serverSideUrl, {
        params: searchParams,
      })
      .then((response) => {
        return response.data.data.map((row: any, idx: number) => {
          /*let filteredRow: any = {}
          //console.log(row[])
          if (exportExcelAddNumber.value) {
            filteredRow = { '#': idx + 1 }
          }
          columnDataNames.forEach((data, index) => {
            console.log(filteredRow[index + 1])
            console.log(row[data])
            filteredRow[index + 1] = row[data]
          })
          return filteredRow*/

          let filteredRow: any = {}
          if (exportExcelAddNumber.value) {
            filteredRow = { '#': idx + 1 }
          }
          columnDataNames.forEach((columnName: string) => {
            filteredRow[columnName] = getNestedPropertyValue(row, columnName)
          })
          return filteredRow
        })
      })
      .catch((error) => {
        isLoading.value = false
        console.error('Error:', error)
        return null
      })
  } else {
    let rowsVisible = dt.rows({ search: 'applied' }).nodes()
    let rowsWithoutDisplayNone = rowsVisible.filter(
      (row: any) => $(row).css('display') !== 'none'
    )
    let fileIsVisible = rowsWithoutDisplayNone
      .map((row: any) => dt.row(row).data())
      .toArray()

    filteredData = fileIsVisible.map((row: any, index: number) => {
      let filteredRow: any = {}
      if (exportExcelAddNumber.value) {
        filteredRow = { '#': index + 1 }
      }
      columnDataNames.forEach((idx: number) => {
        filteredRow[idx] = row[idx]
      })
      return filteredRow
    })
  }

  const title = $(document).prop('title')
  let workbook = XLSX.utils.book_new()
  let worksheet = XLSX.utils.aoa_to_sheet([])
  XLSX.utils.sheet_add_aoa(worksheet, [[title]], { origin: 'A1' })
  worksheet['!cols'] = columnDataNames.map((columnName: any, idx: number) => {
    const maximumWidth = calculateMaximumWidthPerColumn(
      filteredData,
      columnName,
      columnTitles[idx]
    )
    return { wch: maximumWidth }
  })
  worksheet['!rows'] = [{ hpt: 30 }]
  worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: columnTitles.length - 1 } }]
  XLSX.utils.sheet_add_aoa(worksheet, [columnTitles], { origin: 'A2' })
  XLSX.utils.sheet_add_json(worksheet, filteredData, {
    origin: 'A3',
    skipHeader: true,
    cellStyles: true,
  })
  filteredData.forEach((_: any, idx: number) => {
    worksheet['!rows'][idx + 2] = { hpt: 15 }
  })

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Hoja1')

  const currentDate = new Date()
  const formattedDate = formatDate(currentDate, false)
  const filename = title + '_' + formattedDate + '.xlsx'
  XLSX.writeFile(workbook, filename)
  isLoading.value = false
}

function calculateMaximumWidthPerColumn(
  data: any,
  columnIndex: number,
  titleColumn: any
) {
  let maxWidth = titleColumn.length
  data.forEach((fila: any) => {
    if (fila[columnIndex]) {
      const lengthText = fila[columnIndex].toString().length
      if (lengthText > maxWidth) {
        maxWidth = lengthText
      }
    }
  })
  return Math.min(maxWidth, 20)
}

function formatDate(date: Date, hour: boolean): string {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  return hour ? `${day}-${month}-${year} ${hours}:${minutes}` : `${day}-${month}-${year}`
}

const exportToPdf = () => {
  nextTick(() => {
    dt.button('.btn-pdf').trigger()
  })
}

const resetButton = () => {
  nextTick(() => {
    dt.button('.btn-reset').trigger()
  })
}

onMounted(function () {
  dt = table.value.dt
  dt.columns().every(function (this: any) {
    const column = this
    const header = $(column.header())

    if (column.visible()) {
      header.addClass('show-columns')
    }
  })

  dt.on('init.dt', function () {
    searchColumn.value = !!localStorage.getItem(props.serverSideUrl + '_searchColumn')
    emit('infoTable', dt.page.info())
  })

  dt.on('draw', function () {
    emit('infoTable', dt.page.info())
    let body = $(dt.table().body())
    body.unhighlight()
    body.highlight(dt.search())
  })

  /*dt.on('preXhr', function () {
    placeLoad(true)
    isLoading.value = true
  })

  dt.on('xhr', function () {
    placeLoad(false)
    isLoading.value = false
  })*/

  const dataAll = dt.buttons.exportData({
    columns: '.show-columns:not(.noVis)',
  })
  orientation.value = dataAll.header.length > 7 ? 'Horizontal' : 'Vertical'
  dt.on(
    'column-visibility.dt',
    function (e: any, settings: any, columnIdx: any, state: any) {
      let columnHeader = $(dt.column(columnIdx).header())
      if (state) {
        columnHeader.addClass('show-columns')
      } else {
        columnHeader.removeClass('show-columns')
      }

      const dataAll = dt.buttons.exportData({
        columns: '.show-columns:not(.noVis)',
      })

      orientation.value = dataAll.header.length > 7 ? 'Horizontal' : 'Vertical'

      if (groupRows.value) {
        checkGroupRows()
      } else {
        groupCheck.value = false
      }
    }
  )

  const reader = new FileReader()
  reader.onload = (e: any) => {
    logoDataUrl.value = e.target.result
  }
  fetch(logo)
    .then((res) => res.blob())
    .then((blob) => {
      reader.readAsDataURL(blob)
    })
})

watch(groupRows, () => {
  checkGroupRows()
})

watch(searchColumn, () => {
  searchColumn.value
    ? localStorage.setItem(props.serverSideUrl + '_searchColumn', 'true')
    : localStorage.removeItem(props.serverSideUrl + '_searchColumn')
  searchAdvanced()
})

watchEffect(() => {
  if (props.updateTableEvent) {
    updateTable()
  }
})
</script>

<template>
  <div class="table">
    <div class="table-head">
      <div class="table-head-right">
        <VButton
          icon="fas fa-sync"
          :loading="isLoading"
          rounded
          @click="updateTable()"
        >
          Actualizar
        </VButton>
        <VIconButton
          color="primary"
          icon="fa fa-file-excel"
          outlined
          title="Exportar a Excel"
          @click="modelExcel"
        />

        <VIconButton
          color="info"
          icon="feather:printer"
          outlined
          title="Exportar a Pdf"
          @click="exportToPdf"
        />

        <VControl subcontrol>
          <VSwitchSegment
            v-if="props.searchColumns"
            v-model="searchColumn"
            label-true="Busqueda Avanzada"
            color="primary"
          />
        </VControl>

        <VControl subcontrol>
          <VSwitchSegment
            v-if="props.groupColumn"
            v-model="groupRows"
            label-true="Agrupar vista actual"
            color="warning"
          />
        </VControl>

        <VIconButton
          icon="feather:repeat"
          outlined
          title="Restaurar Tabla"
          @click="resetButton"
        />
      </div>
    </div>

    <DataTable
      ref="table"
      :options="options"
      class="is-striped is-hoverable is-fullwidth hover nowrap"
    />
  </div>
  <VModal
    :open="smallFormOpen"
    title="Generar Reporte"
    size="small"
    actions="right"
    @close="smallFormOpen = false"
  >
    <template #content>
      <div class="modal-form">
        <table class="table-export">
          <tr>
            <th>Formato de Página</th>
            <th>
              <VField>
                <VControl>
                  <VSelect v-model="sizePage">
                    <VOption value="Letter">
                      Carta
                    </VOption>
                    <VOption value="A4">
                      A4
                    </VOption>
                    <VOption value="Legal">
                      Oficio
                    </VOption>
                  </VSelect>
                </VControl>
              </VField>
            </th>
          </tr>
          <tr>
            <th>Orientación</th>
            <th>
              <div class="buttons-orientation">
                <label
                  class="page-orientation"
                  :class="{ active: orientation === 'Vertical' }"
                >
                  <input
                    v-model="orientation"
                    type="radio"
                    name="orientation"
                    value="Vertical"
                    class="page-orientation-button"
                  >
                  <span class="orientation-image">
                    <svg
                      width="38.619mm"
                      height="51.46mm"
                      viewBox="0 0 38.619 51.46"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g
                        transform="translate(-4.1091 -73.526)"
                        stroke-linecap="round"
                      >
                        <g
                          transform="matrix(0 -.78686 -.93007 0 125.15 164.61)"
                          fill="none"
                          stroke="#858585"
                          stroke-width="1.5044"
                        >
                          <path
                            d="m55.683 89.515c-2.5342 3.18e-4 -4.5744 2.0402-4.5744 4.5744v30.725c0 2.5342 2.0402 4.5744 4.5744 4.5744h54.624c2.5342 0 4.5715-2.0402 4.5744-4.5744l0.0212-18.528c-0.86381-0.84614-12.225-11.457-17.381-16.776z"
                          />
                          <path
                            d="m98.216 90.368v10.451c0 2.5342 2.0411 4.6399 4.5744 4.5744l11.148-0.0262c-1.2866-1.2822-14.352-13.7-15.723-14.999z"
                          />
                        </g>
                        <text
                          transform="scale(1.0052 .99478)"
                          x="9.5490484"
                          y="116.74443"
                          fill="#808080"
                          font-family="'Annapurna SIL'"
                          font-size="44.894px"
                          letter-spacing="0px"
                          stroke="#000000"
                          stroke-opacity="0"
                          stroke-width="1.287"
                          word-spacing="0px"
                          style="
                            font-variant-caps: normal;
                            font-variant-east-asian: normal;
                            font-variant-ligatures: normal;
                            font-variant-numeric: normal;
                          "
                          xml:space="preserve"
                        >
                          <tspan
                            x="9.5490484"
                            y="116.74443"
                            fill="#808080"
                            font-family="'Annapurna SIL'"
                            font-size="44.894px"
                            stroke="#000000"
                            stroke-opacity="0"
                            stroke-width="1.287"
                            style="
                              font-variant-caps: normal;
                              font-variant-east-asian: normal;
                              font-variant-ligatures: normal;
                              font-variant-numeric: normal;
                            "
                          >
                            A
                          </tspan>
                        </text>
                      </g>
                    </svg>
                  </span>
                  <p>Vertical</p>
                </label>
                <label
                  class="page-orientation"
                  :class="{ active: orientation === 'Horizontal' }"
                >
                  <input
                    v-model="orientation"
                    type="radio"
                    name="orientation"
                    value="Horizontal"
                    class="page-orientation-button"
                  >
                  <span class="orientation-image">
                    <svg
                      width="51.46mm"
                      height="38.619mm"
                      viewBox="0 0 51.46 38.619"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g
                        transform="translate(-35.194 -155.96)"
                        stroke-linecap="round"
                      >
                        <g
                          transform="matrix(.78686 0 0 .93007 -4.4291 73.537)"
                          fill="none"
                          stroke="#858585"
                          stroke-width="1.5044"
                        >
                          <path
                            d="m55.683 89.515c-2.5342 3.18e-4 -4.5744 2.0402-4.5744 4.5744v30.725c0 2.5342 2.0402 4.5744 4.5744 4.5744h54.624c2.5342 0 4.5715-2.0402 4.5744-4.5744l0.0212-18.528c-0.86381-0.84614-12.225-11.457-17.381-16.776z"
                          />
                          <path
                            d="m98.216 90.368v10.451c0 2.5342 2.0411 4.6399 4.5744 4.5744l11.148-0.0262c-1.2866-1.2822-14.352-13.7-15.723-14.999z"
                          />
                        </g>
                        <text
                          transform="scale(1.0052 .99478)"
                          x="44.78146"
                          y="190.44469"
                          fill="#808080"
                          font-family="'Annapurna SIL'"
                          font-size="44.894px"
                          letter-spacing="0px"
                          stroke="#000000"
                          stroke-opacity="0"
                          stroke-width="1.287"
                          word-spacing="0px"
                          style="
                            font-variant-caps: normal;
                            font-variant-east-asian: normal;
                            font-variant-ligatures: normal;
                            font-variant-numeric: normal;
                          "
                          xml:space="preserve"
                        >
                          <tspan
                            x="44.78146"
                            y="190.44469"
                            fill="#808080"
                            font-family="'Annapurna SIL'"
                            font-size="44.894px"
                            stroke="#000000"
                            stroke-opacity="0"
                            stroke-width="1.287"
                            style="
                              font-variant-caps: normal;
                              font-variant-east-asian: normal;
                              font-variant-ligatures: normal;
                              font-variant-numeric: normal;
                            "
                          >
                            A
                          </tspan>
                        </text>
                      </g>
                    </svg>
                  </span>
                  <p>Horizontal</p>
                </label>
              </div>
            </th>
          </tr>
          <tr>
            <th colspan="2">
              <VField label="Descripcion">
                <VControl>
                  <VInput
                    v-model="description"
                    type="text"
                    placeholder=""
                  />
                </VControl>
              </VField>
            </th>
          </tr>
          <tr>
            <th>Incluir el total de registros</th>
            <th>
              <VControl subcontrol>
                <VSwitchSegment
                  v-model="exportPdfAllData"
                  label-true="(Hasta 5.000 registros)"
                  color="primary"
                />
              </VControl>
            </th>
          </tr>
          <tr>
            <th>Enumerar filas</th>
            <th>
              <VControl subcontrol>
                <VSwitchSegment
                  v-model="exportPdfAddNumber"
                  color="primary"
                />
              </VControl>
            </th>
          </tr>
          <tr>
            <th colspan="2">
              <VField
                label="Observación"
                class=""
              >
                <VControl>
                  <VInput
                    v-model="observation"
                    type="text"
                    placeholder=""
                  />
                </VControl>
              </VField>
            </th>
          </tr>
        </table>
      </div>
    </template>
    <template #action>
      <VButton
        color="primary"
        raised
        :loading="isLoading"
        :disabled="isLoading"
        @click="generateAndOpenPDF"
      >
        Generar
      </VButton>
    </template>
  </VModal>

  <VModal
    :open="modelExportExcel"
    title="Exportar Datos"
    size="small"
    actions="right"
    @close="modelExportExcel = false"
  >
    <template #content>
      <div class="modal-form">
        <table class="table-export">
          <tr>
            <th>Incluir el total de registros</th>
            <th>
              <VControl subcontrol>
                <VSwitchSegment
                  v-model="exportExcelAllData"
                  color="primary"
                />
              </VControl>
            </th>
          </tr>
          <tr>
            <th>Enumerar filas</th>
            <th>
              <VControl subcontrol>
                <VSwitchSegment
                  v-model="exportExcelAddNumber"
                  color="primary"
                />
              </VControl>
            </th>
          </tr>
        </table>
      </div>
    </template>
    <template #action>
      <VButton
        color="primary"
        raised
        :loading="isLoading"
        :disabled="isLoading"
        @click="exportToExcel"
      >
        Exportar
      </VButton>
    </template>
  </VModal>
</template>
