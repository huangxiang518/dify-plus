'use client'
import type { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next' // add cancelSyncToAppTemplate to list extend
import cn from '@/utils/classnames'
import { ThumbsUp } from '@/app/components/base/icons/src/vender/line/alertsAndFeedback'

export type ICategoryProps = {
  className?: string
  list: string[]
  value: string
  onChange: (value: string) => void
  /**
   * default value for search param 'category' in en
   */
  allCategoriesEn: string
}

const Category: FC<ICategoryProps> = ({
  className,
  list,
  value,
  onChange,
  allCategoriesEn,
}) => {
  const { t } = useTranslation()
  const isAllCategories = !list.includes(value as AppCategory) || value === allCategoriesEn

  const itemClassName = (isSelected: boolean) => cn(
    'flex h-[32px] cursor-pointer items-center rounded-lg border-[0.5px] border-transparent px-3 py-[7px] font-medium leading-[18px] text-gray-700 hover:bg-gray-200',
    isSelected && 'border-gray-200 bg-white text-primary-600 shadow-xs hover:bg-white',
  )

  return (
    <div className={cn(className, 'flex flex-wrap space-x-1 text-[13px]')}>
      <div
        className={itemClassName(isAllCategories)}
        onClick={() => onChange(allCategoriesEn)}
      >
        <ThumbsUp className='mr-1 h-3.5 w-3.5' />
        {t('explore.apps.allCategories')}
      </div>
      {list.filter(name => name !== allCategoriesEn).map(name => (
        <div
          key={name}
          className={itemClassName(name === value)}
          onClick={() => onChange(name)}
        >
          {name}
        </div>
      ))}
    </div>
  )
}

export default React.memo(Category)
