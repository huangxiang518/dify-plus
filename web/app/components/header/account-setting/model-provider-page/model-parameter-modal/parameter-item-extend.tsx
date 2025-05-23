import type { FC } from 'react'
import { useState } from 'react'
import type { ModelParameterRule } from '../declarations'
import { useLanguage } from '../hooks'
import { isNullOrUndefined } from '../utils'
import cn from '@/utils/classnames'
import Switch from '@/app/components/base/switch'
import Tooltip from '@/app/components/base/tooltip'
import Slider from '@/app/components/base/slider'
import Radio from '@/app/components/base/radio'
import { SimpleSelect } from '@/app/components/base/select'
import TagInput from '@/app/components/base/tag-input'

export type ParameterValue = number | string | string[] | boolean | undefined

type ParameterItemProps = {
  parameterRule: ModelParameterRule
  value?: ParameterValue
  onChange?: (value: ParameterValue) => void
  className?: string
  onSwitch?: (checked: boolean, assignValue: ParameterValue) => void
  isInWorkflow?: boolean
}
const ParameterItem: FC<ParameterItemProps> = ({
  parameterRule,
  value,
  onChange,
  className,
  onSwitch,
  isInWorkflow,
}) => {
  const language = useLanguage()
  const [localValue, setLocalValue] = useState(value)

  const getDefaultValue = () => {
    let defaultValue: ParameterValue

    if (parameterRule.type === 'int' || parameterRule.type === 'float')
      defaultValue = isNullOrUndefined(parameterRule.default) ? (parameterRule.min || 0) : parameterRule.default
    else if (parameterRule.type === 'string')
      defaultValue = parameterRule.options?.length ? (parameterRule.default || '') : (parameterRule.default || '')
    else if (parameterRule.type === 'boolean')
      defaultValue = !isNullOrUndefined(parameterRule.default) ? parameterRule.default : false
    else if (parameterRule.type === 'tag')
      defaultValue = !isNullOrUndefined(parameterRule.default) ? parameterRule.default : []

    return defaultValue
  }

  const renderValue = value ?? localValue ?? getDefaultValue()

  const handleInputChange = (newValue: ParameterValue) => {
    setLocalValue(newValue)

    if (onChange && (parameterRule.name === 'stop' || !isNullOrUndefined(value) || parameterRule.required))
      onChange(newValue)
  }

  const handleSlideChange = (num: number) => {
    if (!isNullOrUndefined(parameterRule.max) && num > parameterRule.max!) {
      handleInputChange(parameterRule.max)
      return
    }

    if (!isNullOrUndefined(parameterRule.min) && num < parameterRule.min!) {
      handleInputChange(parameterRule.min)
      return
    }

    handleInputChange(num)
  }

  const handleRadioChange = (v: number) => {
    handleInputChange(v === 1)
  }

  const handleStringInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleInputChange(e.target.value)
  }

  const handleSelect = (option: { value: string | number; name: string }) => {
    handleInputChange(option.value)
  }

  const handleTagChange = (newSequences: string[]) => {
    handleInputChange(newSequences)
  }

  const handleSwitch = (checked: boolean) => {
    if (onSwitch) {
      const assignValue: ParameterValue = localValue || getDefaultValue()

      onSwitch(checked, assignValue)
    }
  }

  const renderInput = () => {
    const numberInputWithSlide = (parameterRule.type === 'int' || parameterRule.type === 'float')
      && !isNullOrUndefined(parameterRule.min)
      && !isNullOrUndefined(parameterRule.max)

    if (parameterRule.type === 'int' || parameterRule.type === 'float') {
      let step = 100
      if (parameterRule.max) {
        if (parameterRule.max < 10)
          step = 0.1
        else if (parameterRule.max < 100)
          step = 1
        else if (parameterRule.max < 1000)
          step = 10
        else if (parameterRule.max < 10000)
          step = 100
      }

      return (
        numberInputWithSlide && <Slider
          className='w-[120px]'
          value={renderValue as number}
          min={parameterRule.min}
          max={parameterRule.max}
          step={step}
          onChange={handleSlideChange}
        />
      )
    }

    if (parameterRule.type === 'boolean') {
      return (
        <Radio.Group
          className='w-[200px] flex items-center'
          value={renderValue ? 1 : 0}
          onChange={handleRadioChange}
        >
          <Radio value={1} className='!mr-1 w-[94px]'>True</Radio>
          <Radio value={0} className='w-[94px]'>False</Radio>
        </Radio.Group>
      )
    }

    if (parameterRule.type === 'string' && !parameterRule.options?.length) {
      return (
        <input
          className={cn(isInWorkflow ? 'w-[200px]' : 'w-full', 'ml-4 flex items-center px-3 h-8 appearance-none outline-none rounded-lg bg-gray-100 text-[13px] text-gra-900')}
          value={renderValue as string}
          onChange={handleStringInputChange}
        />
      )
    }

    if (parameterRule.type === 'text') {
      return (
        <textarea
          className='w-full h-20 ml-4 px-1 rounded-lg bg-gray-100 outline-none text-[12px] text-gray-900'
          value={renderValue as string}
          onChange={handleStringInputChange}
        />
      )
    }

    if (parameterRule.type === 'string' && !!parameterRule?.options?.length) {
      return (
        <SimpleSelect
          className='!py-0'
          wrapperClassName={cn(isInWorkflow ? '!w-[200px]' : 'w-full', 'ml-4 !h-8')}
          defaultValue={renderValue as string}
          onSelect={handleSelect}
          items={parameterRule.options.map(option => ({ value: option, name: option }))}
        />
      )
    }

    if (parameterRule.type === 'tag') {
      return (
        <div className={cn(isInWorkflow ? 'w-[200px]' : 'w-full', 'ml-4')}>
          <TagInput
            items={renderValue as string[]}
            onChange={handleTagChange}
            customizedConfirmKey='Tab'
            isInWorkflow={isInWorkflow}
          />
        </div>
      )
    }

    return null
  }

  return (
    <div className={`flex items-center justify-between relative ${className}`}>
      <div>
        <div className={cn(isInWorkflow ? 'w-[140px]' : 'w-full', 'ml-4 shrink-0 flex items-center')}>
          <div
            className='mr-0.5 text-[13px] font-medium text-gray-700 truncate'
            title={parameterRule.label[language] || parameterRule.label.en_US}
          >
            {parameterRule.label[language] || parameterRule.label.en_US}
          </div>
          {
            parameterRule.help && (
              <>
                <Tooltip
                  popupContent={(
                    <div className='w-[200px] whitespace-pre-wrap'>{parameterRule.help[language] || parameterRule.help.en_US}</div>
                  )}
                  popupClassName='mr-1'
                  triggerClassName='mr-1 w-4 h-4 shrink-0'
                >
                </Tooltip>
                <span className={'absolute bottom-[-3px] right-16 text-xs text-orange-600'}>{renderValue}</span>
              </>
            )
          }
          {
            !parameterRule.required && parameterRule.name !== 'stop' && (
              <Switch
                defaultValue={!isNullOrUndefined(value)}
                onChange={handleSwitch}
                size='md'
              />
            )
          }
        </div>
        {
          parameterRule.type === 'tag' && (
            <div className={cn(!isInWorkflow && 'w-[200px]', 'text-gray-400 text-xs font-normal')}>
              {parameterRule?.tagPlaceholder?.[language]}
            </div>
          )
        }
      </div>
      {renderInput()}
    </div>
  )
}

export default ParameterItem
